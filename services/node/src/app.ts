import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { fastify } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";
import fs from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import openapiTS, { astToString } from "openapi-typescript";
import path from "path";
import { parse as querystringParser } from "qs-esm";

import env, { dev } from "./env.js";
import viemPlugin from "./plugins/viem.js";
import wsPlugin from "./plugins/ws.js";
import apiPlugin from "./plugins/api.js";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./constants/contract.js";

const app = fastify({
  logger: dev(
    {
      level: "trace",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
        },
      },
    },
    true,
  ),
  querystringParser,
});

await app.register(cors, {
  origin: "*",
});

app
  .register(fastifySwagger, {
    openapi: {
      info: {
        title: `Node service rest api`,
        version: "1.0.0",
      },
      servers: [],
    },
    transform: jsonSchemaTransform,
  })
  .register(fastifySwaggerUI, {
    routePrefix: "/documentation",
  })
  .register(viemPlugin, {
    ETHEREUM_HOLESKY_JSON_RPC_URL: env.ETHEREUM_HOLESKY_JSON_RPC_URL,
    ETHEREUM_HOLESKY_WSS_URL: env.ETHEREUM_HOLESKY_WSS_URL,
    ETHEREUM_MAINNET_JSON_RPC_URL: env.ETHEREUM_MAINNET_JSON_RPC_URL,
    ETHEREUM_MAINNET_WSS_URL: env.ETHEREUM_MAINNET_WSS_URL,
    CONTRACT_ADDRESS: CONTRACT_ADDRESS,
    CONTRACT_ABI: CONTRACT_ABI,
  })
  .register(wsPlugin, {
    prefix: "/ws",
  })
  .register(apiPlugin, {
    prefix: "/api",
  })
  .ready(async (err) => {
    if (err) throw err;
    if (env.NODE_ENV !== "development") return;
    const spec = app.swagger({ yaml: true });
    const types = astToString(await openapiTS(spec));
    const dir = dirname(fileURLToPath(import.meta.url));
    const destination = path.join(
      dirname(dirname(dirname(dir))),
      "packages/openapi",
    );
    await fs.writeFile(path.join(destination, "node.spec.yaml"), spec);
    await fs.writeFile(path.join(destination, "node.spec.ts"), types);
  });

export default app;
