import fp from "fastify-plugin";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import websocket from "@fastify/websocket";
import { serializeBigInt } from "../utils.js";

const plugin = fp(
  (fastify, opts, done) => {
    const app = fastify.withTypeProvider<ZodTypeProvider>();
    const { viem, log } = app;
    const { mainnet } = viem;
    log.info(`Registering ${app.pluginName}...`);

    app.register(websocket).register(async function (app) {
      app.get("/", { websocket: true }, (socket, req) => {
        const unwatch = mainnet.watchEvent((event) => {
          socket.send(JSON.stringify(event, (_, v) => serializeBigInt(v)));
        });

        socket.on("open", () => {
          log.info("Socket open");
        });

        socket.on("close", () => {
          log.info("Socket close");
          unwatch();
        });
      });
    });

    log.info(`${app.pluginName} registration completed!`);
    done();
  },
  {
    name: "plugin:ws",
    fastify: "5.x",
    encapsulate: true,
  },
);

export default plugin;
