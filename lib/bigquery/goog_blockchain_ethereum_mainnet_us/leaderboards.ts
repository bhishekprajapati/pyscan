import { BigQueryTimestamp } from "@google-cloud/bigquery";
import bytes from "bytes";
import { z } from "zod";

import { QueryHandler } from "../query-handler";
import { timeseriesFilters } from "./schema";

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
          SUM(value_change) AS amount,
          SUM(tx_count) AS txCount
        FROM all_txns
        WHERE address != '0x0000000000000000000000000000000000000000'
        GROUP BY address
        HAVING SUM(value_change) > 0
        ORDER BY amount DESC
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
      amount: string;
      txCount: string;
    };

    if (result.success) {
      return {
        success: true,
        data: result.data[0] as TData[],
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
          ABS(SUM(value_change)) AS amount,
          SUM(tx_count) AS txCount,
        FROM all_txns
        WHERE address != '0x0000000000000000000000000000000000000000'
        GROUP BY address
        HAVING SUM(value_change) < 0
        ORDER BY amount DESC
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
      amount: string;
      txCount: string;
    };

    if (result.success) {
      return {
        success: true,
        data: result.data[0] as TData[],
      };
    }

    return result;
  };

  return {
    getSenderLeadersByTokenAddress,
    getReceiverLeadersByTokenAddress,
  };
}
