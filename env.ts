import { z } from "zod";

const env = z
  .object({
    AUTH_DRIZZLE_URL: z.string().url(),
    AUTH_DRIZZLE_BASE64_CA: z.string().min(1),
    ETHEREUM_MAINNET_JSON_RPC_URL: z.string().url(),
    ETHEREUM_HOLESKY_JSON_RPC_URL: z.string().url(),
    ETHEREUM_MAINNET_WSS_URL: z.string().url(),
    ETHEREUM_HOLESKY_WSS_URL: z.string().url(),
    COINMARKET_API_KEY: z.string().min(1),
  })
  .readonly()
  .parse(process.env);

export default env;
