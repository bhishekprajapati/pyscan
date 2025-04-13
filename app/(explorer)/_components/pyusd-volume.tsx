import PyusdVolumeChart from "@/components/charts/pyusd-volume";
import bigquery from "@/lib/bigquery";
import { pyusd } from "@/lib/coinmarketcap";
import { revalidate } from "@/utils/cache";
import { devOnly } from "@/utils/dev";
import { unstable_cache as cache } from "next/cache";

const getCachedVolumeData = cache(
  async () => {
    const result = await pyusd.getQuote();
    if (!result.success) {
      throw Error(result.err.message);
    }

    const { quote } = result.data.PYUSD[0];
    const { client } = bigquery;

    // Query Cost: ~9GB
    const [data] = await client.query({
      query: `
      WITH WeeklyTransfers AS (
        SELECT
          DATE_TRUNC(DATE(block_timestamp), WEEK) AS week_start,
          COUNT(*) AS total_transactions,
          SUM(SAFE_CAST(value AS FLOAT64) / POW(10, 6)) AS total_pyusd_transferred -- Convert from
          FROM bigquery-public-data.crypto_ethereum.token_transfers
        WHERE
          LOWER(token_address) = '0x6c3ea9036406852006290770bedfcaba0e23a0e8' -- PYUSD Contract
          AND DATE(block_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 WEEK) -- Last 12 weeks
        GROUP BY
          week_start
        ORDER BY
          week_start DESC
      )
      SELECT
        FORMAT_DATE('%Y-%m-%d', week_start) AS week_start,
        total_transactions,
        total_pyusd_transferred
      FROM WeeklyTransfers;    
    `,
    });

    type TData = {
      week_start: string;
      total_transactions: number;
      total_pyusd_transferred: number;
    };

    return {
      data: (data as TData[]).map(
        ({ week_start, total_transactions, total_pyusd_transferred }) => ({
          date: week_start,
          txnCount: total_transactions,
          vol: total_pyusd_transferred,
          timeframe: "week",
        }),
      ),
      price: quote.USD.price,
      timestamp: Date.now(),
    };
  },
  [],
  {
    revalidate: revalidate["10GB"],
  },
);

const getDummyVolumeData = async (): ReturnType<
  typeof getCachedVolumeData
> => ({
  data: [
    { date: "2025-04-01", txnCount: 3245, vol: 1294387, timeframe: "1d" },
    { date: "2025-04-02", txnCount: 2980, vol: 1149032, timeframe: "1d" },
    { date: "2025-04-03", txnCount: 3765, vol: 1459820, timeframe: "1d" },
    { date: "2025-04-04", txnCount: 4012, vol: 1582344, timeframe: "1d" },
    { date: "2025-04-05", txnCount: 2893, vol: 1093845, timeframe: "1d" },
    { date: "2025-04-06", txnCount: 3120, vol: 1184501, timeframe: "1d" },
    { date: "2025-04-07", txnCount: 3478, vol: 1367823, timeframe: "1d" },
  ],
  price: 1,
  timestamp: Date.now(),
});

const PyusdVolume = async () => {
  const fetcher = devOnly(getCachedVolumeData, getDummyVolumeData);
  const res = await fetcher();
  return <PyusdVolumeChart {...res} />;
};

export default PyusdVolume;
