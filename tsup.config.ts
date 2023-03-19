import { defineConfig } from 'tsup';

import unimport from 'unimport/unplugin';

import consola from 'consola';

export default defineConfig({
  entry: ['src/**/*.ts', '!**/*.{d,config}.ts', '!node_modules/'],
  esbuildPlugins: [
    unimport.esbuild({
      dts: true,
      include: ['src/**/*.ts'],
      exclude: ['node_modules/', '**/*.js'],
      dirs: ['src/**/*.ts'], // Importante, sem isso ele não reconhece os arquivos 'de para' onde será importados
      presets: [
        // 'presets' e 'imports' é aonde você importa as libs que você deseja utilizar.
        {
          from: 'express',
          imports: [
            {
              name: 'default',
              as: 'express',
            },
            {
              name: 'Express',
              type: true,
            },
          ],
        },
      ],
      imports: [
        {
          name: 'default',
          as: 'consola',
          from: 'consola',
        },
        {
          name: 'randomBytes',
          from: 'crypto',
        },
      ],
      resolveId(id, importee) {
        // Pegando o arquivo local
        const fromImport = id.split(process.cwd())[1];

        // Caso o 'arquivo' seja uma lib, ele ira retornar, exemplo: 'consola'
        if (!fromImport) {
          return id;
        }

        // Mapeando os locais
        const fromLocalImport = fromImport.replace(
          new RegExp(`${process.cwd()}|src/`, 'gi'),
          ''
        );
        
        const toImport = importee!.replace(
          new RegExp(`${process.cwd()}|src/`, 'gi'),
          ''
        );

        // Pegando quantas slashs (/) tem cada arquivo
        const fromLocalSlashAmount = fromLocalImport.split('/').length - 1;

        const toLocalSlashAmount = toImport.split('/').length - 1;

        consola.debug('from', fromLocalImport, fromLocalSlashAmount);

        consola.debug('to', toImport, toLocalSlashAmount);

        // declarando a váriavel de resultado
        let localImportResult = '';

        /**
         * 
         * unimport, no final dessa execução, ele adiciona uma barra automática, tem que trabalhar encima disso,
         * caso não tratar de já essa 'problema', a importação ficaria tipo: './/foo.js' ou '..//../foo/bar.js'
         * 
         * Caso o local aonde será importado só tem 1 barra, ele adicionará '.' no começo
         * ficando: './foo.js'
         * 
         * Caso o local aonde está sendo importado tem mais barras, ele adicionará '../'
         * 
         * Assim formando '../foo/bar.js' e '../../foo/bar.js', adicionando '../' infinitamente */
        if (toLocalSlashAmount === 1) {
          localImportResult = localImportResult.concat('.', fromLocalImport);
        } else {
          for (let i = 1; i < toLocalSlashAmount; i++) {
            // aqui está sendo adicionado somente as barras, exemplo: '../../../../' ou '..'
            localImportResult =
              i === toLocalSlashAmount - 1
                ? localImportResult.concat('..')
                : localImportResult.concat('../');
          }

          // após ele concatenar as barras, irá adicionar o local de importação
          localImportResult = localImportResult.concat(fromLocalImport);
        }

        /**
         * trocando o final da importação para 'js', senão a importação ficaria
         * '../../foo/bar.ts' e o arquivo não iria ser lido pelo node
         */
        localImportResult = localImportResult.replace(/ts$/, 'js')

        consola.debug('result', localImportResult);

        // Caso de tudo certo, o formato a ser retornado deve ser: './bar.js' ou '../../foo/bar.js'...
        return localImportResult;
      },
      warn: consola.warn,
      debugLog: consola.debug,
    }),
  ],
  /**
   * Compila os módulos de forma recursiva no arquivo de destino
   * veja: https://esbuild.github.io/api/#bundle
   */
  bundle: false,
  format: 'esm', // Formato ESModule (Mais recente)
  treeshake: true, // Remoção de código não utilizado
  minify: false, // Reduz o tamanho do arquivo (Arquivo de destino fica ilegível)
  clean: true, // Limpa o diretório após compilar
  sourcemap: true, // Gera arquivos '.js.map' para debug
});
