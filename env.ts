import { z } from "zod";

const env = z
  .object({
    ETHEREUM_MAINNET_JSON_RPC_URL: z.string().url(),
    ETHEREUM_HOLESKY_JSON_RPC_URL: z.string().url(),
    ETHEREUM_MAINNET_WSS_URL: z.string().url(),
    ETHEREUM_HOLESKY_WSS_URL: z.string().url(),
    COINMARKET_API_KEY: z.string().min(1),
  })
  .readonly()
  .parse(process.env);

export default env;
