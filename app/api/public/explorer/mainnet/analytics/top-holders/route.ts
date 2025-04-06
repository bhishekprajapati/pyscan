import { api, InferApiResponse } from "@/lib/api.helpers";
import bigquery from "@/lib/bigquery";
import ethereum from "@/lib/ethereum";

const { CONTRACT_ADDRESS } = ethereum;

export type GetTopHoldersApiResponse = InferApiResponse<typeof GET>;

export const GET = api(async (_, res) => {
  const eth = bigquery.ethereum.mainnet;
  const result = await eth.getTopHolders(CONTRACT_ADDRESS, 10);
  if (!result.success) {
    const { isInternal, reason } = result;
    return res.error({ name: "internal_server_error" });
  }
  return res.data(result.data);
});
