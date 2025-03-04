import fp from "fastify-plugin";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

const plugin = fp(
  (fastify, opts, done) => {
    const app = fastify.withTypeProvider<ZodTypeProvider>();
    const { viem, log } = app;
    const { mainnet } = viem;
    log.info(`Registering ${app.pluginName}...`);

    app.get("/", async () => mainnet.getLogs());

    log.info(`${app.pluginName} registration completed!`);
    done();
  },
  {
    name: "plugin:api",
    fastify: "5.x",
    encapsulate: true,
  },
);

export default plugin;
