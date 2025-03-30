import bigquery from "@/lib/bigquery";
import ethereum from "@/lib/ethereum";
import type { NextApiRequest, NextApiResponse } from "next";

const { CONTRACT_ADDRESS } = ethereum;

export type TransfersApiResponse = ApiResponse<
  Extract<
    Awaited<ReturnType<typeof bigquery.ethereum.mainnet.getTokenTransfers>>,
    { success: true }
  >["data"]
>;

async function handler(
  _: NextApiRequest,
  res: NextApiResponse<TransfersApiResponse>,
) {
  const eth = bigquery.ethereum.mainnet;
  const result = await eth.getTokenTransfers(CONTRACT_ADDRESS, 10);

  if (!result.success) {
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
