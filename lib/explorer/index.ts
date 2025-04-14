import { unstable_cache as cache } from "next/cache";
import bigquery from "../bigquery";

export const getCachedTransactionByTokenAddress = cache(
  async (
    address: string,
    opts: { limit: number; page: number; date: Date },
  ) => {
    const result =
      await bigquery.ethereum.mainnet.explorer.getTransactionByTokenAddress(
        address,
        opts,
      );

    if (!result.success) {
      throw Error(result.reason);
    }

    return {
      ...result.data,
      timestamp: new Date().toISOString(),
    };
  },
  [],
  {
    revalidate: 15 * 60, // 15 mins
  },
);
