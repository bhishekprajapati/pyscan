import bigquery from "@/lib/bigquery";
import type { NextApiRequest, NextApiResponse } from "next";

export type BlocksApiResponse = ApiResponse<
  Extract<
    Awaited<ReturnType<typeof bigquery.ethereum.mainnet.getBlocks>>,
    { success: true }
  >["data"]
>;

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlocksApiResponse>,
) {
  const eth = bigquery.ethereum.mainnet;
  const result = await eth.getBlocks(req.query as any);

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
