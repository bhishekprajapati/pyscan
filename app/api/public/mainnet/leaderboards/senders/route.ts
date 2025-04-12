import { api, InferApiResponse } from "@/lib/api.helpers";
import bigquery from "@/lib/bigquery";
import { z } from "zod";

const { leaderboards } = bigquery.ethereum.mainnet;

// TODO: write strict checks
const querySchema = z.object({
  tokenAddress: z.string(),
});

export type GetSenderLeaderboardApiResponse = InferApiResponse<typeof GET>;
export type GetSenderLeaderboardQuerySchema = z.infer<typeof querySchema>;

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

  const result = await leaderboards.getSenderLeadersByTokenAddress(
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
