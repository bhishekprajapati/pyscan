import { api, type InferApiResponse } from "@/lib/api.helpers";
import bigquery from "@/lib/bigquery";

export type BlocksApiResponse = InferApiResponse<typeof GET>;

export const GET = api(async (req, res) => {
  const eth = bigquery.ethereum.mainnet;
  // @ts-expect-error dynamic
  const result = await eth.getBlocks(req.nextUrl.searchParams);

  if (!result.success) {
    return res.error({
      name: "validation_error",
    });
  }

  return res.data(result.data);
});
