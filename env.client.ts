import { z } from "zod";

const env = z
  .object({
    NEXT_PUBLIC_NODE_SERVICE_URL: z.string().url(),
  })
  .readonly()
  .parse({
    NEXT_PUBLIC_NODE_SERVICE_URL: process.env["NEXT_PUBLIC_NODE_SERVICE_URL"],
  });

export default env;
