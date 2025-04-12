import bytes from "bytes";
import { QueryHandler } from "../query-handler";

// TODO: build cachable queries
export default function leaderboards(query: QueryHandler) {
  const getReceiverLeadersByTokenAddress = async (tokenAddress: string) => {
    const sql = `
        WITH incoming AS (
          SELECT
            to_address AS address,
            CAST(value AS BIGNUMERIC) AS value_change,
            1 AS tx_count
          FROM
            bigquery-public-data.crypto_ethereum.token_transfers
          WHERE
            LOWER(token_address) = LOWER(@tokenAddress)
            AND block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR)
        ),

        outgoing AS (
          SELECT
            from_address AS address,
            -CAST(value AS BIGNUMERIC) AS value_change,
            0 AS tx_count  
          FROM
            bigquery-public-data.crypto_ethereum.token_transfers
          WHERE
            LOWER(token_address) = LOWER(@tokenAddress)
            AND block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR)
        ),

        all_txns AS (
          SELECT * FROM incoming
          UNION ALL
          SELECT * FROM outgoing
        )

        SELECT
          address,
          SUM(value_change) AS totalRawValue,
          SUM(tx_count) AS txCount
        FROM all_txns
        WHERE address != '0x0000000000000000000000000000000000000000'
        GROUP BY address
        HAVING SUM(value_change) > 0
        ORDER BY totalRawValue DESC
        LIMIT 100;
      `;

    const result = await query({
      query: sql,
      useLegacySql: false,
      location: "US",
      params: {
        tokenAddress,
      },
    });

    type TData = {
      address: string;
      totalRawValue: Big;
      txCount: string;
    };

    if (result.success) {
      return {
        success: result.success,
        data: (result.data[0] as TData[]).map(({ totalRawValue, ...rest }) => ({
          totalRawValue: totalRawValue.toString(),
          ...rest,
        })),
      };
    }

    return result;
  };

  const getSenderLeadersByTokenAddress = async (tokenAddress: string) => {
    const sql = `
        WITH incoming AS (
          SELECT
            to_address AS address,
            CAST(value AS BIGNUMERIC) AS value_change,
            0 AS tx_count  -- not counting received in negative section
          FROM
            bigquery-public-data.crypto_ethereum.token_transfers
          WHERE
            LOWER(token_address) = LOWER(@tokenAddress)
            AND block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR)
        ),
        outgoing AS (
          SELECT
            from_address AS address,
            -CAST(value AS BIGNUMERIC) AS value_change,
            1 AS tx_count
          FROM
            bigquery-public-data.crypto_ethereum.token_transfers
          WHERE
            LOWER(token_address) = LOWER(@tokenAddress)
            AND block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR)
        ),

        all_txns AS (
          SELECT * FROM incoming
          UNION ALL
          SELECT * FROM outgoing
        )

        SELECT
          address,
          ABS(SUM(value_change)) AS totalRawValue,
          SUM(tx_count) AS txCount,
        FROM all_txns
        WHERE address != '0x0000000000000000000000000000000000000000'
        GROUP BY address
        HAVING SUM(value_change) < 0
        ORDER BY totalRawValue DESC
        LIMIT 100;
      `;

    const result = await query({
      query: sql,
      useLegacySql: false,
      params: {
        tokenAddress,
      },
    });

    type TData = {
      address: string;
      totalRawValue: Big;
      txCount: string;
    };

    if (result.success) {
      return {
        success: result.success,
        data: (result.data[0] as TData[]).map(({ totalRawValue, ...rest }) => ({
          totalRawValue: totalRawValue.toString(),
          ...rest,
        })),
      };
    }

    return result;
  };

  const getBurnLeadersByTokenAddress = async (tokenAddress: string) => {
    const sql = `
      DECLARE tokenAddress STRING DEFAULT '${tokenAddress}';
      DECLARE burn_address STRING DEFAULT '0x0000000000000000000000000000000000000000';
      DECLARE start_timestamp TIMESTAMP DEFAULT TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY);
      SELECT
        from_address AS address,
        SUM(CAST(value AS BIGNUMERIC)) AS totalRawValue
      FROM
        bigquery-public-data.crypto_ethereum.token_transfers
      WHERE
        LOWER(token_address) = LOWER(tokenAddress)
        AND to_address = burn_address
        AND block_timestamp >= start_timestamp
      GROUP BY
        address
      ORDER BY
        totalRawValue DESC
      LIMIT 100; 
    `;

    type TData = {
      address: string;
      totalRawValue: Big;
    };

    const result = await query({
      query: sql,
      useLegacySql: false,
      maximumBytesBilled: bytes("10GB")?.toString(),
    });

    if (result.success) {
      return {
        success: result.success,
        data: (result.data[0] as TData[]).map(({ totalRawValue, ...rest }) => ({
          totalRawValue: totalRawValue.toString(),
          ...rest,
        })),
      };
    }

    return result;
  };

  const getTopHoldersByTokenAddress = async (tokenAddress: string) => {
    const sql = `
      DECLARE tokenAddress STRING DEFAULT '${tokenAddress}';
      DECLARE start_timestamp TIMESTAMP DEFAULT TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 180 DAY);
      SELECT
        address,
        SUM(amount) AS totalRawValue
      FROM (
        SELECT
          to_address AS address,
          CAST(value AS BIGNUMERIC) AS amount
        FROM
          bigquery-public-data.crypto_ethereum.token_transfers
        WHERE
          LOWER(token_address) = LOWER(tokenAddress)
          AND to_address != '0x0000000000000000000000000000000000000000'
          AND block_timestamp >= start_timestamp
        UNION ALL
        SELECT
          from_address AS address,
          -CAST(value AS BIGNUMERIC) AS amount
        FROM
          bigquery-public-data.crypto_ethereum.token_transfers
        WHERE
          LOWER(token_address) = LOWER(tokenAddress)
          AND from_address != '0x0000000000000000000000000000000000000000'
          AND block_timestamp >= start_timestamp
      ) AS transfers
      GROUP BY
        address
      HAVING
        SUM(amount) > 0
      ORDER BY
        totalRawValue DESC
      LIMIT 100;
    `;

    type TData = {
      address: string;
      totalRawValue: Big;
    };

    const result = await query({
      query: sql,
      useLegacySql: false,
      maximumBytesBilled: bytes("50GB")?.toString(),
    });

    if (result.success) {
      return {
        success: result.success,
        data: (result.data[0] as TData[]).map(({ totalRawValue, ...rest }) => ({
          totalRawValue: totalRawValue.toString(),
          ...rest,
        })),
      };
    }

    return result;
  };

  return {
    getSenderLeadersByTokenAddress,
    getReceiverLeadersByTokenAddress,
    getBurnLeadersByTokenAddress,
    getTopHoldersByTokenAddress,
  };
}
