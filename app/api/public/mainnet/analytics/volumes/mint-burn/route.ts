import { api, InferApiResponse } from "@/lib/api.helpers";
import bigquery from "@/lib/bigquery";
import { timeseriesFilters } from "@/lib/bigquery/goog_blockchain_ethereum_mainnet_us/schema";
import { primaryOrSecondaryTokenAddressSchema } from "@/lib/validator";
import { z } from "zod";

const { timeseries } = bigquery.ethereum.mainnet.analytics;

const querySchema = z.object({
  tokenAddress: primaryOrSecondaryTokenAddressSchema,
  filter: timeseriesFilters.private,
});

export type PostMintBurnApiResponse = InferApiResponse<typeof POST>;
export type PostMintBurnSearchQuery = z.infer<typeof querySchema>;

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

  const result = await timeseries.getMintAndBurnVolumeByTokenAddress(
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
