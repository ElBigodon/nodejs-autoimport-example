/**
 * Problema de tipagem, mesmo o typescript sabendo que a função `express` é importado
 * não consegue reconhecer a tipagem. Para solucionar isso, adicionei a tipagem de forma manual.
 */
const server: Express = express();

// Usando formado JSON para formatar o corpo da requisição
server.use(express.json());

// Passando um middleware
server.use((req, res, next) => {
  const { passthrough } = req.query;

  if (!passthrough || parseInt(passthrough as string) !== 1) {
    return res
      .status(401)
      .send("adicione a query 'passthrough' com valor '1' para continuar!");
  }

  next();
});

// Mapeando rota
server.get('/', (req, res) => {
  consola.info("Requisição '/' solicitada");
  res.send({
    message: 'Hello World!',
    serverUptime: `${Application.uptime() / 1000}s`,
    serverUptimeAs: `${new Date(Application.applicationUptime).toLocaleString()}`,
  });
});

// Iniciando a instancia
server.listen(3000, () => {
  consola.info("Servidor rodando na porta '3000'");
  /**
   * console de debug de exemplo
   * Alternativa de tudo isso é usar `process.uptime()`, mas isso é um exemplo, então ...
   */
  consola.debug(`app started in ${Application.uptime()}ms`);
});

// console de info de exemplo
consola.info(`Application secret is: ${SECRET}`);
