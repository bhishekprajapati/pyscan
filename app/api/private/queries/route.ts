import { z } from "zod";

import { auth, InferApiResponse } from "@/lib/api.helpers";
import bigquery from "@/lib/bigquery";
import { sqlQuerySchema } from "@/lib/schema";
import { isBigQueryError } from "@/lib/bigquery/errors";
import bytes from "bytes";
import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/lib/redis";

const bodySchema = z.object({
  query: sqlQuerySchema,
});

const rate = new Ratelimit({
  limiter: Ratelimit.slidingWindow(10, `${60 * 60 * 24}s`),
  redis,
});

export type ExecuteQueryApiResponse = InferApiResponse<typeof POST>;
export type ExecuteQuerySchema = z.infer<typeof bodySchema>;

export const POST = auth(async (req, res, { session }) => {
  const json = await req.json();
  const validation = bodySchema.safeParse(json);

  if (!validation.success) {
    return res.error(
      {
        name: "validation_error",
        message: validation.error
          .flatten()
          .fieldErrors.query?.map((m) => m)
          .join(", "),
      },
      {
        status: 400,
      },
    );
  }

  const { data: body } = validation;
  const { query } = body;

  if (!session.user?.email) {
    return res.error(
      {
        name: "email_not_found",
      },
      {
        status: 400,
      },
    );
  }

  // check limits by email
  const { limit, remaining, reset } = await rate.limit(session.user.email);

  if (remaining === 0) {
    return res.error(
      {
        name: "rate_limit_error",
        message: "Quota exceeded for today. Quota will be renewed in 24 hours",
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      },
    );
  }

  try {
    const [result] = await bigquery.client.query({
      query,
      useLegacySql: false,
      maximumBytesBilled: bytes("100MB")?.toString(),
      allowLargeResults: false,
      maxResults: 100,
      useQueryCache: true,
    });
    return res.data(result);
  } catch (err) {
    if (isBigQueryError(err) && err.code === 400) {
      const message = err.errors[0].message;
      if (message.startsWith("Query exceeded limit")) {
        return res.error(
          {
            name: "query_limit_exceeded",
          },
          {
            status: 400,
          },
        );
      }
    }
    throw err;
  }
});
