import bigquery from "@/lib/bigquery";
import ethereum from "@/lib/ethereum";
import type { NextApiRequest, NextApiResponse } from "next";

const { CONTRACT_ADDRESS } = ethereum;

async function handler(_: NextApiRequest, res: NextApiResponse) {
  const eth = bigquery.ethereum.mainnet;
  const result = await eth.getTopHolders(CONTRACT_ADDRESS, 10);

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
