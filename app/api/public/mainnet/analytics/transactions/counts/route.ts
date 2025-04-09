import stablecoins from "@/constants/stablecoins";
import { api, InferApiResponse } from "@/lib/api.helpers";
import bigquery from "@/lib/bigquery";
import { timeseriesFilters } from "@/lib/bigquery/goog_blockchain_ethereum_mainnet_us/schema";
import { z } from "zod";

const { timeseries } = bigquery.ethereum.mainnet.analytics;

// Todo: Make this validation more strict and seal tight
const tokensSchema = z.array(
  z.object({
    address: z.string(),
    label: z.string().trim().min(1).max(5),
  }),
);

const querySchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("any"),
    filter: timeseriesFilters.public,
  }),
  z.object({
    type: z.literal("transfers"),
    filter: timeseriesFilters.private,
    tokens: tokensSchema,
  }),
]);

export type PostTransactionCountsApiResponse = InferApiResponse<typeof POST>;
export type PostTransactionCountSearchQuery = z.infer<typeof querySchema>;

export const POST = api(async (req, { data, error }) => {
  const body = await req.json();
  const validation = querySchema.safeParse(body);
  if (!validation.success) {
    return error(
      {
        name: "validation_error",
      },
      {
        status: 400,
      },
    );
  }

  const query = validation.data;

  if (query.type === "any") {
    const result = await timeseries.getTxnCount(query.filter);
    if (result.success)
      return data({
        type: query.type,
        dataset: result.data,
      });
  }

  if (query.type === "transfers") {
    const result = await timeseries.getTokenTransferCountByTokenAddresses(
      query.tokens,
      query.filter,
    );

    if (result.success)
      return data({
        type: query.type,
        dataset: result.data,
      });
  }

  return error({
    name: "internal_server_error",
  });
});
