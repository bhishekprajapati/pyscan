import { api, type InferApiResponse } from "@/lib/api.helpers";
import bigquery from "@/lib/bigquery";
import { isPrimaryTokenAddress } from "@/lib/validator";

export type GetTransferApiResponse = InferApiResponse<typeof GET>;

export const GET = api(async (_, res, { params }) => {
  const tokenAddress = (await params)["id"];

  if (!isPrimaryTokenAddress(tokenAddress)) {
    return res.error({
      name: "validation_error",
      message: "Invalid token address",
    });
  }

  // TODO: support pagination
  const result = await bigquery.ethereum.mainnet.getTokenTransfers(
    tokenAddress,
    10,
  );

  if (!result.success) {
    return res.error({
      name: "internal_server_error",
    });
  }

  return res.data(result.data);
});
