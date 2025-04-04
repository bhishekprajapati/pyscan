import PyusdVolumeChart from "@/components/charts/pyusd-volume";
import bigquery from "@/lib/bigquery";

const getDummyVolumeData = async () => {};

const getCachedVolumeData = async () => {
  const { client } = bigquery;

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

  return {
    data,
    timestamp: Date.now(),
  };
};

const PyusdVolume = () => {
  return <PyusdVolumeChart />;
};

export default PyusdVolume;
