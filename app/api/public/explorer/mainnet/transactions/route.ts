import { api, type InferApiResponse } from "@/lib/api.helpers";
import bigquery from "@/lib/bigquery";

export type GetTransactionsApiResponse = InferApiResponse<typeof GET>;

export const GET = api(async (req, res) => {
  const eth = bigquery.ethereum.mainnet;
  const result = await eth.getBlocks(req.nextUrl.searchParams as any);

  if (!result.success) {
    return res.error(
      {
        name: "validation_error",
      },
      {
        status: 400,
      },
    );
  }

  return res.data(result.data);
});
