import env from "@/env";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: env.UPSTASH_REDIS_KV_REST_API_URL,
  token: env.UPSTASH_REDIS_KV_REST_API_TOKEN,
});

export default redis;
