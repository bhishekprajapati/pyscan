import "dotenv/config";
import { z } from "zod";

const env = z
  .object({
    ETHEREUM_MAINNET_JSON_RPC_URL: z.string().url(),
    ETHEREUM_HOLESKY_JSON_RPC_URL: z.string().url(),
    ETHEREUM_MAINNET_WSS_URL: z.string().url(),
    ETHEREUM_HOLESKY_WSS_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    SERVER_HOST: z.string().default("localhost"),
    SERVER_PORT: z.coerce.number().default(8080),
  })
  .readonly()
  .parse(process.env);

export const dev = <T>(value: T, fallback: any = {}): T =>
  env.NODE_ENV === "development" ? value : fallback;

export default env;
