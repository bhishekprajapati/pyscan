import bigquery from "@/lib/bigquery";
import ethereum from "@/lib/ethereum";
import type { NextApiRequest, NextApiResponse } from "next";

const { CONTRACT_ADDRESS } = ethereum;

export type TransferCountsApiResponse = ApiResponse<
  Extract<
    Awaited<ReturnType<typeof bigquery.ethereum.mainnet.getTokenTransferCount>>,
    { success: true }
  >["data"]
>;

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TransferCountsApiResponse>,
) {
  const query = req.query;
  const eth = bigquery.ethereum.mainnet;

  // @ts-expect-error
  const result = await eth.getTokenTransferCount({
    address: CONTRACT_ADDRESS,
    ...query,
  });

  if (!result.success) {
    console.error(result);
    const { isInternal, reason } = result;
    res.status(500).json({
      ok: false,
      error: {
        name: "unknown",
        message: isInternal ? "Internal server error" : reason,
      },
    });
    return;
  }

  res.status(200).json({
    ok: true,
    data: result.data,
  });
}

export default handler;
