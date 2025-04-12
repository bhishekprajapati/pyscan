import { api, InferApiResponse } from "@/lib/api.helpers";
import bigquery from "@/lib/bigquery";
import ethereum from "@/lib/ethereum";

const { CONTRACT_ADDRESS } = ethereum;

export type GetTransferCountsApiResponse = InferApiResponse<typeof GET>;

export const GET = api(async (req, res) => {
  const query = req.nextUrl.searchParams;
  const eth = bigquery.ethereum.mainnet;

  // @ts-expect-error dynamic
  const result = await eth.getTokenTransferCount({
    address: CONTRACT_ADDRESS,
    ...query,
  });
  if (!result.success) {
    return res.error({ name: "internal_server_error" });
  }
  return res.data(result.data);
});
