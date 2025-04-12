import { api, type InferApiResponse } from "@/lib/api.helpers";
import bigquery from "@/lib/bigquery";
import {
  pageLimit,
  timestampCursor,
} from "@/lib/bigquery/goog_blockchain_ethereum_mainnet_us/schema";
import { z } from "zod";

const eth = bigquery.ethereum.mainnet;

export type BlocksApiResponse = InferApiResponse<typeof GET>;
export type BlocksApiResponseQuery = z.infer<typeof querySchema>;

const querySchema = z.object({
  limit: pageLimit.default("25"),
  cursor: z.union([timestampCursor, z.undefined()]),
});

export const GET = api(async (req, res) => {
  const q = req.nextUrl.searchParams;

  const query = querySchema.parse({
    limit: q.get("limit"),
    cursor: q.get("cursor"),
  });

  const result = await eth.getBlocks(
    query.limit,
    query.cursor ?? new Date().toISOString(),
  );

  if (!result.success) {
    return res.error({
      name: "validation_error",
    });
  }

  return res.data(result.data);
});
