import type { FastifyListenOptions } from "fastify";
import env from "./env.js";
import app from "./app.js";

async function run() {
  await app.ready();

  const opts: FastifyListenOptions = {
    host: env.SERVER_HOST,
    port: env.SERVER_PORT,
    listenTextResolver: (address) =>
      `node service running on ${address}`,
  };

  app.listen(opts, (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
}

run();
