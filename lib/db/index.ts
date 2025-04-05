import env from "@/env";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const pool = postgres(env.AUTH_DRIZZLE_URL, {
  max: 5,
  ssl: {
    ca: Buffer.from(env.AUTH_DRIZZLE_BASE64_CA, "base64").toString(),
  },
});

export const db = drizzle(pool);
