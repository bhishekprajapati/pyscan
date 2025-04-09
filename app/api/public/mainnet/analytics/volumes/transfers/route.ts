import { api, InferApiResponse } from "@/lib/api.helpers";
import bigquery from "@/lib/bigquery";
import { timeseriesFilters } from "@/lib/bigquery/goog_blockchain_ethereum_mainnet_us/schema";
import { z } from "zod";

const { timeseries } = bigquery.ethereum.mainnet.analytics;

// TODO: write strict checks
const querySchema = z.object({
  tokenAddress: z.string(),
  filter: timeseriesFilters.public,
});

export type PostTokenTransferVolumeApiResponse = InferApiResponse<typeof POST>;
export type PostTokenTransferVolumeSearchQuery = z.infer<typeof querySchema>;

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

  const result = await timeseries.getTokenTransferVolumeByTokenAddress(
    query.tokenAddress,
    query.filter,
  );

  if (result.success) {
    return data({
      dataset: result.data,
      timestamp: Date.now(),
    });
  }

  return error({
    name: "internal_server_error",
  });
});
