import { api, InferApiResponse } from "@/lib/api.helpers";
import ethereum from "@/lib/ethereum";
import { isPrimaryTokenAddress } from "@/lib/validator";

const latestTransfers = ethereum.mainnet.liveTokenTransferStack;
const getLatestTransfers = (tokenAddress: string) =>
  latestTransfers
    .toArray()
    .filter(
      ({ address }) => address.toLowerCase() === tokenAddress.toLowerCase(),
    )
    .map(({ record }) => record);

export type GetLatestTokenTransferApiResponse = InferApiResponse<typeof GET>;
export const GET = api(async (_, res, { params }) => {
  const p = await (params as unknown as Promise<Record<string, string>>);
  const tokenAddress = p["id"];
  if (!isPrimaryTokenAddress(tokenAddress)) {
    return res.error(
      {
        name: "validation_error",
        message: "unspported token address",
      },
      {
        status: 400,
      },
    );
  }

  return res.data(getLatestTransfers(tokenAddress));
});
