import { api, InferApiResponse } from "@/lib/api.helpers";
import bigquery from "@/lib/bigquery";
import { z } from "zod";

const { aggregated } = bigquery.ethereum.mainnet.analytics;

// TODO: write strict checks
const querySchema = z.object({
  tokenAddress: z.string(),
});

export type GetRecieverLeaderboardApiResponse = InferApiResponse<typeof GET>;
export type GetRecieverLeaderboardQuerySchema = z.infer<typeof querySchema>;

export const GET = api(async (req, { data, error }) => {
  const validation = querySchema.safeParse({
    tokenAddress: req.nextUrl.searchParams.get("tokenAddress"),
  });

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

  const result = await aggregated.getReceiverLeadersByTokenAddress(
    query.tokenAddress,
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
