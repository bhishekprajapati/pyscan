import bigquery from "@/lib/bigquery";
import NetworkCongestionChart from "@/components/charts/network-congestion";
import { devOnly } from "@/utils/dev";
import { BigQueryDate } from "@google-cloud/bigquery";
import { unstable_cache as cache } from "next/cache";
import { revalidate } from "@/utils/cache";

const getCachedCongestionData = cache(
  async () => {
    const [data] = await bigquery.client.query({
      query: `
        WITH PyusdTxns AS (
      SELECT
        transaction_hash,
        DATE(block_timestamp) AS tx_date,
        gas_price
      FROM
        bigquery-public-data.goog_blockchain_ethereum_mainnet_us.transactions
      WHERE
        DATE(block_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY) -- Last 30 days only
        AND (
          LOWER(to_address) = '0x6c3ea9036406852006290770bedfcaba0e23a0e8'
          OR LOWER(from_address) = '0x6c3ea9036406852006290770bedfcaba0e23a0e8'
        )
    ),
    Receipts AS (
      SELECT
        transaction_hash,
        SUM(gas_used) AS total_gas_used
      FROM
        bigquery-public-data.goog_blockchain_ethereum_mainnet_us.receipts
      WHERE
        DATE(block_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY) -- Match transactions filter
      GROUP BY transaction_hash
    )
    SELECT
      p.tx_date,
      COUNT(p.transaction_hash) AS total_pyusd_txns,
      SUM(r.total_gas_used) AS total_gas_used,
      SAFE_DIVIDE(SUM(p.gas_price), COUNT(p.transaction_hash)) / POWER(10,9) AS avg_gas_price_gwei
    FROM PyusdTxns p
    JOIN Receipts r
    ON p.transaction_hash = r.transaction_hash
    GROUP BY p.tx_date
    ORDER BY p.tx_date DESC;
    `,
    });

    type TData = {
      tx_date: BigQueryDate;
      total_pyusd_txns: number;
      total_gas_used: number;
      avg_gas_price_gwei: number;
    };

    return {
      data: (data as TData[]).map(
        ({
          tx_date,
          total_pyusd_txns,
          avg_gas_price_gwei,
          total_gas_used,
        }) => ({
          date: tx_date.value,
          txnCount: total_pyusd_txns,
          /**
           * In gwei
           */
          avgGasPrice: avg_gas_price_gwei,
          /**
           * In gwei
           */
          gasUsed: total_gas_used,
        }),
      ),
      timestamp: Date.now(),
    };
  },
  [],
  {
    revalidate: revalidate["10GB"],
  },
);

const getDummyCongestionData = async (): ReturnType<
  typeof getCachedCongestionData
> => ({
  data: [
    {
      date: "2025-03-05",
      txnCount: 1867,
      avgGasPrice: 5.5537027264183179,
      gasUsed: 99712744,
    },
    {
      date: "2025-03-06",
      txnCount: 2062,
      avgGasPrice: 5.4080481901687678,
      gasUsed: 108289330,
    },
    {
      date: "2025-03-07",
      txnCount: 2137,
      avgGasPrice: 5.8431085675334575,
      gasUsed: 112975733,
    },
    {
      date: "2025-03-08",
      txnCount: 1683,
      avgGasPrice: 5.5253987273060012,
      gasUsed: 89734810,
    },
    {
      date: "2025-03-09",
      txnCount: 1534,
      avgGasPrice: 5.7365848380769231,
      gasUsed: 82237313,
    },
    {
      date: "2025-03-10",
      txnCount: 1691,
      avgGasPrice: 9.0410768250887052,
      gasUsed: 90115514,
    },
    {
      date: "2025-03-11",
      txnCount: 1913,
      avgGasPrice: 6.40801762089702,
      gasUsed: 101483990,
    },
    {
      date: "2025-03-12",
      txnCount: 1821,
      avgGasPrice: 5.8074765099489287,
      gasUsed: 97193780,
    },
    {
      date: "2025-03-13",
      txnCount: 1711,
      avgGasPrice: 5.6615274664243138,
      gasUsed: 92034305,
    },
    {
      date: "2025-03-14",
      txnCount: 2286,
      avgGasPrice: 5.9168356952427823,
      gasUsed: 121352091,
    },
    {
      date: "2025-03-15",
      txnCount: 1976,
      avgGasPrice: 6.1401953926452428,
      gasUsed: 105017332,
    },
    {
      date: "2025-03-16",
      txnCount: 1508,
      avgGasPrice: 5.6067464786783816,
      gasUsed: 80366441,
    },
    {
      date: "2025-03-17",
      txnCount: 1886,
      avgGasPrice: 6.090388975188759,
      gasUsed: 100394202,
    },
    {
      date: "2025-03-18",
      txnCount: 2110,
      avgGasPrice: 7.0584221449094793,
      gasUsed: 111054525,
    },
    {
      date: "2025-03-19",
      txnCount: 2878,
      avgGasPrice: 7.7594712341132723,
      gasUsed: 149402609,
    },
    {
      date: "2025-03-20",
      txnCount: 3336,
      avgGasPrice: 7.9555730216687648,
      gasUsed: 171253518,
    },
    {
      date: "2025-03-21",
      txnCount: 3530,
      avgGasPrice: 7.8346681260824367,
      gasUsed: 182171658,
    },
    {
      date: "2025-03-22",
      txnCount: 2935,
      avgGasPrice: 7.8982513666408867,
      gasUsed: 151171348,
    },
    {
      date: "2025-03-23",
      txnCount: 2388,
      avgGasPrice: 7.7591745086666668,
      gasUsed: 123169634,
    },
    {
      date: "2025-03-24",
      txnCount: 3917,
      avgGasPrice: 7.1992722909734486,
      gasUsed: 197896082,
    },
    {
      date: "2025-03-25",
      txnCount: 3111,
      avgGasPrice: 5.3770005879405334,
      gasUsed: 160699152,
    },
    {
      date: "2025-03-26",
      txnCount: 3141,
      avgGasPrice: 1.1979662077921045,
      gasUsed: 163386918,
    },
    {
      date: "2025-03-27",
      txnCount: 3442,
      avgGasPrice: 1.1793169505427077,
      gasUsed: 177858721,
    },
    {
      date: "2025-03-28",
      txnCount: 3443,
      avgGasPrice: 1.1398840745875689,
      gasUsed: 178114122,
    },
    {
      date: "2025-03-29",
      txnCount: 3052,
      avgGasPrice: 1.0419196661569463,
      gasUsed: 158627876,
    },
    {
      date: "2025-03-30",
      txnCount: 3184,
      avgGasPrice: 1.0096965513825378,
      gasUsed: 163674635,
    },
    {
      date: "2025-03-31",
      txnCount: 4186,
      avgGasPrice: 1.1733836510819398,
      gasUsed: 214477387,
    },
    {
      date: "2025-04-01",
      txnCount: 3468,
      avgGasPrice: 1.335887346127451,
      gasUsed: 180483970,
    },
    {
      date: "2025-04-02",
      txnCount: 3852,
      avgGasPrice: 1.4595501247897196,
      gasUsed: 196884265,
    },
    {
      date: "2025-04-03",
      txnCount: 3782,
      avgGasPrice: 1.3939273590499734,
      gasUsed: 194834098,
    },
    {
      date: "2025-04-04",
      txnCount: 1011,
      avgGasPrice: 0.95143088741740844,
      gasUsed: 52615834,
    },
  ],
  timestamp: Date.now(),
});

const NetworkCongestion = async () => {
  const fetcher = devOnly(getCachedCongestionData, getDummyCongestionData);
  const res = await fetcher();
  return <NetworkCongestionChart {...res} />;
};

export default NetworkCongestion;
