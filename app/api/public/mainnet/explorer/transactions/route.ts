import { api, type InferApiResponse } from "@/lib/api.helpers";
import bigquery from "@/lib/bigquery";

export type GetTransactionsApiResponse = InferApiResponse<typeof GET>;

export const GET = api(async (req, res) => {
  const eth = bigquery.ethereum.mainnet;
  const q = req.nextUrl.searchParams;
  // const result = await eth.getBlocks({
  //   // @ts-expect-error dynamic
  //   cursor: q.get("cursor"),
  //   // @ts-expect-error dynamic
  //   limit: q.get("limit"),
  // });

  // if (!result.success) {
  //   return res.error(
  //     {
  //       name: "validation_error",
  //     },
  //     {
  //       status: 400,
  //     },
  //   );
  // }

  return res.data([]);
});
