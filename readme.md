# Sistema de auto importação no node.js

Minha inspiração para fazer isso veio do [Nuxt.js](https://nuxt.com/) aonde o back-end (server/) tem auto importação de arquivos locais e módulos.

Libs que estou usando para fazer isso acontecer:

- [unimport](https://github.com/unjs/unimport) aonde está fazendo tudo isso acontecer.

- [tsup](https://github.com/egoist/tsup) usado para compilação, aonde tem compartibilidade com unimport, baseado no esbuild.

## ⚠️ Atenção 
Não tente reproduzir isso em produção, não sei quais serão as circunstancias ao longo do tempo, uso, desempenho, peso, etc.