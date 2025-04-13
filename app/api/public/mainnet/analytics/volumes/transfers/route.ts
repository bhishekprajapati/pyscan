import { api, InferApiResponse } from "@/lib/api.helpers";
import bigquery from "@/lib/bigquery";
import { timeseriesFilters } from "@/lib/bigquery/goog_blockchain_ethereum_mainnet_us/schema";
import { primaryOrSecondaryTokenAddressSchema } from "@/lib/validator";
import { z } from "zod";

const { timeseries } = bigquery.ethereum.mainnet.analytics;

const querySchema = z.object({
  tokenAddresses: z.array(
    z.object({
      address: primaryOrSecondaryTokenAddressSchema,
      label: z.string().trim().min(1).max(5),
    }),
  ),
  filter: timeseriesFilters.private,
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

  const result = await timeseries.getTokenTransferVolumeByTokenAddresses(
    query.tokenAddresses,
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
