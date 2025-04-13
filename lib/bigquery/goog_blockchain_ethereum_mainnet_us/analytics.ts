import { BigQueryDate, BigQueryTimestamp } from "@google-cloud/bigquery";
import bytes from "bytes";
import { z } from "zod";

import { QueryHandler } from "../query-handler";
import { timeseriesFilters } from "./schema";

// TODO: build cachable queries

export default function analytics(query: QueryHandler) {
  const timeseries = (() => {
    type Filter = z.infer<(typeof timeseriesFilters)["private"]>;

    /**
     * Get gas used by all the transactions which were sent to an address
     */
    const getGasUsageByToAddress = async (
      toAddress: string,
      filter: Filter,
    ) => {
      const { timeframe, limit } = filter;
      const [start, end, unit] = timeseriesFilters.parsetimeframe(
        timeframe,
        limit,
      );

      const sql = `
        WITH FilteredTx AS (
          SELECT
            transaction_hash,
            TIMESTAMP_TRUNC(block_timestamp, ${unit}) AS time_interval
          FROM
            bigquery-public-data.goog_blockchain_ethereum_mainnet_us.transactions
          WHERE
            block_timestamp BETWEEN TIMESTAMP("${start}") AND TIMESTAMP("${end}")
            AND LOWER(to_address) = LOWER(@toAddress)
        ),
        GasData AS (
          SELECT
            transaction_hash,
            gas_used
          FROM
            bigquery-public-data.goog_blockchain_ethereum_mainnet_us.receipts
        WHERE
          block_timestamp BETWEEN TIMESTAMP("${start}") AND TIMESTAMP("${end}")
          AND LOWER(to_address) = LOWER(@toAddress)
        )
        SELECT
          f.time_interval,
          COUNT(f.transaction_hash) AS tx_count,
          SUM(g.gas_used) AS total_gas_used,
          AVG(g.gas_used) AS avg_gas_used_per_tx,
          MIN(g.gas_used) AS min_gas_used_per_tx,
          MAX(g.gas_used) AS max_gas_used_per_tx
        FROM
          FilteredTx AS f
        JOIN
          GasData AS g
        ON
          f.transaction_hash = g.transaction_hash
        GROUP BY
          f.time_interval
        ORDER BY
          f.time_interval DESC
        LIMIT @limit;
      `;

      type TData = {
        time_interval: BigQueryTimestamp;
        tx_count: number;
        sum_gas_used_per_tx: number;
        avg_gas_used_per_tx: number;
        min_gas_used_per_tx: number;
        max_gas_used_per_tx: number;
      };

      const result = await query({
        query: sql,
        params: {
          toAddress,
          limit: filter.limit,
        },
        useLegacySql: false,
        maximumBytesBilled: bytes("25GB")?.toString(),
      });

      if (result.success)
        return {
          success: true,
          data: (result.data[0] as TData[]).map(
            ({
              time_interval,
              tx_count,
              avg_gas_used_per_tx,
              max_gas_used_per_tx,
              min_gas_used_per_tx,
              sum_gas_used_per_tx,
            }) => ({
              timestamp: time_interval.value,
              txCount: tx_count,
              gasUsedPerTx: {
                avg: avg_gas_used_per_tx,
                sum: sum_gas_used_per_tx,
                min: min_gas_used_per_tx,
                max: max_gas_used_per_tx,
              },
            }),
          ),
        };

      return result;
    };

    /**
     * Get transaction count on eth mainnet us
     */
    const getTxnCount = async (filter: Filter) => {
      const { timeframe, limit } = filter;
      const [start, end, unit] = timeseriesFilters.parsetimeframe(
        timeframe,
        limit,
      );
      const sql = `
        SELECT
          TIMESTAMP_TRUNC(t.block_timestamp, ${unit}) AS time_interval,
          COUNT(t.transaction_hash) AS tx_count
        FROM
          bigquery-public-data.goog_blockchain_ethereum_mainnet_us.transactions AS t
        WHERE
          t.block_timestamp BETWEEN TIMESTAMP('${start}') AND TIMESTAMP('${end}')
        GROUP BY
          time_interval
        ORDER BY
          tx_count DESC
        LIMIT
          @limit
        `;

      type TData = {
        time_interval: BigQueryTimestamp;
        tx_count: number;
      };

      const result = await query({
        query: sql,
        params: {
          limit: filter.limit,
        },
        useLegacySql: false,
        maximumBytesBilled: bytes("5GB")?.toString(),
      });

      if (result.success) {
        return {
          success: true,
          data: (result.data[0] as TData[]).map(
            ({ time_interval, tx_count }) => ({
              count: tx_count,
              timestamp: time_interval.value,
            }),
          ),
        };
      }

      return result;
    };

    /**
     * Get transaction count by to address grouped by time
     */
    const getTxnCountByToAddress = async (
      toAddress: string,
      filter: Filter,
    ) => {
      const { timeframe, limit } = filter;
      const [start, end, unit] = timeseriesFilters.parsetimeframe(
        timeframe,
        limit,
      );

      const sql = `
        SELECT
          TIMESTAMP_TRUNC(t.block_timestamp, ${unit}) AS time_interval,
          COUNT(t.transaction_hash) AS tx_count
        FROM
          bigquery-public-data.goog_blockchain_ethereum_mainnet_us.transactions AS t
        WHERE
          t.block_timestamp BETWEEN TIMESTAMP('${start}') AND TIMESTAMP('${end}')
          AND LOWER(t.to_address) = @toAddress
        GROUP BY
          time_interval
        ORDER BY
          tx_count DESC
        LIMIT
          @limit
      `;

      type TData = {
        time_interval: BigQueryTimestamp;
        tx_count: number;
      };

      const result = await query({
        query: sql,
        useLegacySql: false,
        params: {
          limit: filter.limit,
          toAddress,
        },
        maximumBytesBilled: bytes("5GB")?.toString(),
      });

      if (result.success) {
        return {
          success: true,
          data: (result.data[0] as TData[]).map(
            ({ time_interval, tx_count }) => ({
              timestamp: time_interval.value,
              txCount: tx_count,
            }),
          ),
        };
      }

      return result;
    };

    /**
     * How many transfers happened for a give token over a give period of time
     */
    const getTokenTransferCountByTokenAddresses = async (
      tokens: { address: string; label: string }[],
      filter: Filter,
    ) => {
      const { timeframe, limit } = filter;
      const [start, end, unit] = timeseriesFilters.parsetimeframe(
        timeframe,
        limit,
      );

      const sql = `
        SELECT
          COUNT(*) as count,
          TIMESTAMP_TRUNC(block_timestamp, ${unit}) as timestamp,
          CASE
            ${tokens.map(({ address, label }) => `WHEN LOWER(address) = '${address.toLowerCase()}' THEN '${label}'`).join(" ")}
          END AS label
        FROM 
          bigquery-public-data.goog_blockchain_ethereum_mainnet_us.token_transfers
        WHERE 
          LOWER(address) IN (${tokens.map(({ address }) => `'${address.toLowerCase()}'`).join(",")})
          AND  block_timestamp BETWEEN TIMESTAMP('${start}') AND TIMESTAMP('${end}') 
        GROUP BY 
          timestamp, label
        ORDER BY 
          timestamp DESC
        LIMIT
          @limit
      `;

      type TData = {
        timestamp: BigQueryTimestamp;
        count: number;
        label: string;
      };

      const result = await query({
        query: sql,
        useLegacySql: false,
        // Since limit is only defined for one token at a time
        // we need to multiply the limit by number of tokens
        // to get all the records
        params: {
          limit: limit * tokens.length,
        },
        maximumBytesBilled: bytes("10GB")?.toString(),
      });

      if (result.success) {
        return {
          success: true,
          data: (result.data[0] as TData[]).map(({ timestamp, ...rest }) => ({
            timestamp: timestamp.value,
            ...rest,
          })),
        };
      }

      return result;
    };

    const getTokenTransferVolumeByTokenAddresses = async (
      tokens: { address: string; label: string }[],
      filter: Filter,
    ) => {
      const { timeframe, limit } = filter;
      const [start, end, unit] = timeseriesFilters.parsetimeframe(
        timeframe,
        limit,
      );

      const result = await query({
        query: `
          SELECT
            COUNT(*) AS tx_count,
            SUM(SAFE_CAST(value AS BIGNUMERIC)) AS total_value,
            TIMESTAMP_TRUNC(block_timestamp, ${unit}) as timestamp,
            CASE
              ${tokens.map(({ address, label }) => `WHEN LOWER(token_address) = '${address.toLowerCase()}' THEN '${label}'`).join(" ")}
            END AS label
          FROM
            bigquery-public-data.crypto_ethereum.token_transfers
          WHERE
            LOWER(token_address) IN (${tokens.map(({ address }) => `'${address.toLowerCase()}'`).join(",")}) AND
            block_timestamp BETWEEN TIMESTAMP('${start}') AND TIMESTAMP ('${end}')
          GROUP BY
            timestamp, label
          ORDER BY
            timestamp DESC   
          LIMIT @limit
        `,
        params: {
          limit: limit * tokens.length,
        },
        useLegacySql: false,
        maximumBytesBilled: bytes("10GB")?.toString(),
      });

      type TData = {
        timestamp: BigQueryTimestamp;
        tx_count: number;
        total_value: string;
        label: string;
      };

      if (result.success) {
        return {
          success: result.success,
          data: (result.data[0] as TData[]).map(
            ({ timestamp, total_value, tx_count, label }) => ({
              timestamp: timestamp.value,
              totalValue: total_value,
              txCount: tx_count,
              label,
            }),
          ),
        };
      }

      return result;
    };

    const getMintAndBurnVolumeByTokenAddress = async (
      tokenAddress: string,
      filter: Filter,
    ) => {
      const { timeframe, limit } = filter;
      const [start, end, unit] = timeseriesFilters.parsetimeframe(
        timeframe,
        limit,
      );

      const sql = `
        WITH Transfers AS (
          SELECT
            block_timestamp,
            from_address,
            to_address,
            value,
            CASE
              WHEN to_address = '0x0000000000000000000000000000000000000000' THEN 'burn'
              WHEN from_address = '0x0000000000000000000000000000000000000000' THEN 'mint'
              ELSE 'transfer'
            END AS transfer_type,
            SAFE_CAST(value AS BIGNUMERIC) AS amount,
            TIMESTAMP_TRUNC(block_timestamp, ${unit}) as timestamp
          FROM
            bigquery-public-data.crypto_ethereum.token_transfers
          WHERE
            LOWER(token_address) = LOWER(@tokenAddress)
            AND block_timestamp BETWEEN TIMESTAMP('${start}') AND TIMESTAMP('${end}') 
        )

        SELECT
          timestamp,
          SUM(CASE WHEN transfer_type = 'mint' THEN amount ELSE 0 END) AS total_minted_value,
          SUM(CASE WHEN transfer_type = 'burn' THEN amount ELSE 0 END) AS total_burnt_value
        FROM
          Transfers
        GROUP BY
          timestamp
        LIMIT @limit
      `;

      const result = await query({
        query: sql,
        useLegacySql: false,
        maximumBytesBilled: bytes("10GB")?.toString(),
        params: {
          tokenAddress,
          limit,
        },
      });

      type TData = {
        timestamp: BigQueryTimestamp;
        total_minted_value: string;
        total_burnt_value: string;
      };

      if (result.success) {
        return {
          success: true,
          data: (result.data[0] as TData[]).map(
            ({ timestamp, total_burnt_value, total_minted_value }) => ({
              timestamp: timestamp.value,
              totalValue: {
                minted: total_minted_value,
                burnt: total_burnt_value,
              },
            }),
          ),
        };
      }

      return result;
    };

    /** for last 30 days */
    const getActiveUsersByTokenAddress = async (tokenAddress: string) => {
      const sql = `
        DECLARE tokenAddress STRING DEFAULT '${tokenAddress}';
        DECLARE start_timestamp TIMESTAMP DEFAULT TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY);
        DECLARE zero_address STRING DEFAULT '0x0000000000000000000000000000000000000000';
        WITH recent_transfers AS (
          SELECT
            DATE(block_timestamp) AS activity_date,
            from_address,
            to_address
          FROM
            bigquery-public-data.crypto_ethereum.token_transfers
          WHERE
            LOWER(token_address) = LOWER(tokenAddress)
            AND block_timestamp >= start_timestamp
        ),
        daily_active_addresses AS (
          SELECT activity_date AS date, from_address AS user_address
          FROM recent_transfers
          WHERE from_address != zero_address
          UNION ALL
          SELECT activity_date AS date, to_address AS user_address
          FROM recent_transfers
          WHERE to_address != zero_address
        )
        SELECT
          date,
          COUNT(DISTINCT user_address) AS count
        FROM daily_active_addresses
        GROUP BY
          date
        ORDER BY
          date DESC;
      `;

      type TData = {
        date: BigQueryDate;
        count: number;
      };

      const result = await query({
        query: sql,
        useLegacySql: false,
      });

      if (result.success) {
        return {
          success: result.success,
          data: (result.data[0] as TData[]).map(({ date, count }) => ({
            date: date.value,
            count,
          })),
        };
      }

      return result;
    };

    /** for last 30 days */
    const getNewUsersByTokenAddress = async (tokenAddress: string) => {
      const sql = `
        DECLARE tokenAddress STRING DEFAULT '${tokenAddress}';
        DECLARE start_timestamp TIMESTAMP DEFAULT TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY);
        DECLARE zero_address STRING DEFAULT '0x0000000000000000000000000000000000000000';
        WITH recent_transfers AS (
          SELECT
            DATE(block_timestamp) AS activity_date,
            From_address,	
            to_address
          FROM
            bigquery-public-data.crypto_ethereum.token_transfers
          WHERE
            LOWER(token_address) = LOWER(tokenAddress)
            AND block_timestamp >= start_timestamp
        ),
        all_users_in_period AS (
          SELECT activity_date, from_address AS wallet FROM recent_transfers WHERE from_address != zero_address
          UNION ALL
          SELECT activity_date, to_address AS wallet FROM recent_transfers WHERE to_address != zero_address
        ),
        first_seen_in_period AS (
          SELECT
            wallet,
            MIN(activity_date) AS first_interaction_date_in_period
          FROM all_users_in_period
          GROUP BY
            wallet
        )
        SELECT
          first_interaction_date_in_period AS date,
          COUNT(wallet) AS count
        FROM first_seen_in_period
        GROUP BY
          first_interaction_date_in_period
        ORDER BY
          date DESC;

      `;

      type TData = {
        date: BigQueryDate;
        count: number;
      };

      const result = await query({
        query: sql,
        useLegacySql: false,
      });

      if (result.success) {
        return {
          success: result.success,
          data: (result.data[0] as TData[]).map(({ date, count }) => ({
            date: date.value,
            count,
          })),
        };
      }

      return result;
    };

    /** for last 30 days */
    const getUniqueSendersByTokenAddress = async (tokenAddress: string) => {
      const sql = `
        DECLARE tokenAddress STRING DEFAULT '${tokenAddress}';
        DECLARE start_timestamp TIMESTAMP DEFAULT TIMESTAMP_SUB(CURRENT_TIMESTAMP, INTERVAL 30 DAY);
        DECLARE zero_address STRING DEFAULT '0x0000000000000000000000000000000000000000';
        WITH recent_senders AS (
          SELECT
            DATE(block_timestamp) AS activity_date,
            from_address
          FROM
            bigquery-public-data.crypto_ethereum.token_transfers
          WHERE
            LOWER(token_address) = LOWER(tokenAddress)
            AND block_timestamp >= start_timestamp
        )
        SELECT
          activity_date AS date,
          COUNT(DISTINCT from_address) AS count
        FROM recent_senders
        GROUP BY
          activity_date
        ORDER BY
          date DESC;
      `;

      type TData = {
        date: BigQueryDate;
        count: number;
      };

      const result = await query({
        query: sql,
        useLegacySql: false,
      });

      if (result.success) {
        return {
          success: result.success,
          data: (result.data[0] as TData[]).map(({ date, count }) => ({
            date: date.value,
            count,
          })),
        };
      }

      return result;
    };

    /** for last 30 days */
    const getUniqueReceiversUsersByTokenAddress = async (
      tokenAddress: string,
    ) => {
      const sql = `
        DECLARE tokenAddress STRING DEFAULT '${tokenAddress}';
        DECLARE start_timestamp TIMESTAMP DEFAULT TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY);
        DECLARE zero_address STRING DEFAULT '0x0000000000000000000000000000000000000000';
        WITH recent_receivers AS (
          SELECT
            DATE(block_timestamp) AS activity_date,
            to_address
          FROM
            bigquery-public-data.crypto_ethereum.token_transfers
          WHERE
            LOWER(token_address) = LOWER(tokenAddress)
            AND block_timestamp >= start_timestamp  
        )
        SELECT
          activity_date AS date,
          COUNT(DISTINCT to_address) AS count
        FROM recent_receivers
        GROUP BY
          activity_date
        ORDER BY
          date DESC;
      `;

      type TData = {
        date: BigQueryDate;
        count: number;
      };

      const result = await query({
        query: sql,
        useLegacySql: false,
      });

      if (result.success) {
        return {
          success: result.success,
          data: (result.data[0] as TData[]).map(({ date, count }) => ({
            date: date.value,
            count,
          })),
        };
      }
      return result;
    };

    const getHolderGrowthByTokenAddress = async (address: string) => {
      const sql = `
        DECLARE target_token_address STRING DEFAULT '${address}';
        DECLARE null_address STRING DEFAULT '0x0000000000000000000000000000000000000000';
        DECLARE report_start_date DATE DEFAULT DATE('2022-11-08');
        DECLARE report_end_date DATE DEFAULT CURRENT_DATE();
        IF report_start_date > report_end_date THEN
          SET report_start_date = report_end_date;
        END IF;
        WITH
        TransferMovements AS (
          SELECT
            DATE(block_timestamp) AS activity_date,
            to_address AS holder_address,
            CAST(value AS BIGNUMERIC) AS signed_amount
          FROM bigquery-public-data.crypto_ethereum.token_transfers
          WHERE LOWER(token_address) = LOWER(target_token_address)
            AND to_address != null_address
            AND DATE(block_timestamp) >= report_start_date
            AND DATE(block_timestamp) <= report_end_date
          UNION ALL
          SELECT
            DATE(block_timestamp) AS activity_date,
            from_address AS holder_address,
            -CAST(value AS BIGNUMERIC) AS signed_amount
          FROM bigquery-public-data.crypto_ethereum.token_transfers
          WHERE LOWER(token_address) = LOWER(target_token_address)
            AND from_address != null_address
            AND DATE(block_timestamp) >= report_start_date
            AND DATE(block_timestamp) <= report_end_date
        ),
        DailyNetChanges AS (
          SELECT
            activity_date,
            holder_address,
            SUM(signed_amount) AS net_change_on_date
          FROM TransferMovements
          GROUP BY activity_date, holder_address
          HAVING SUM(signed_amount) != 0
        ),
        AddressBalanceHistory AS (
          SELECT
            activity_date,
            holder_address,
            net_change_on_date,
            SUM(net_change_on_date) OVER (
              PARTITION BY holder_address ORDER BY activity_date
            ) AS balance_end_of_day
          FROM DailyNetChanges
        ),
        DailyHolderDelta AS (
          SELECT
            activity_date,
            SUM(
              CASE
                WHEN balance_end_of_day > 0 AND (balance_end_of_day - net_change_on_date) <= 0 THEN 1
                WHEN balance_end_of_day <= 0 AND (balance_end_of_day - net_change_on_date) > 0 THEN -1
                ELSE 0
              END
            ) AS net_holder_change_on_date
          FROM AddressBalanceHistory
          GROUP BY activity_date
        ),
        DateSeries AS (
          SELECT calendar_date
          FROM UNNEST(
              CASE
                  WHEN report_start_date <= report_end_date THEN GENERATE_DATE_ARRAY(report_start_date, report_end_date, INTERVAL 1 DAY)
                  ELSE []
              END
          ) AS calendar_date
        )
        SELECT
          d.calendar_date AS date,
          SUM(COALESCE(delta.net_holder_change_on_date, 0)) OVER (
            ORDER BY d.calendar_date
          ) AS count
        FROM DateSeries AS d
        LEFT JOIN DailyHolderDelta AS delta
          ON d.calendar_date = delta.activity_date
        ORDER BY d.calendar_date;
      `;

      type TData = {
        date: BigQueryDate;
        count: number;
      };

      const result = await query({
        query: sql,
        useLegacySql: false,
        maximumBytesBilled: bytes("200GB")?.toString(),
      });

      if (result.success) {
        return {
          success: result.success,
          data: (result.data[0] as TData[]).map(({ date, count }) => ({
            date: date.value,
            count,
          })),
        };
      }
      return result;
    };

    return {
      getTxnCount,
      getTxnCountByToAddress,
      getGasUsageByToAddress,
      getMintAndBurnVolumeByTokenAddress,
      getTokenTransferVolumeByTokenAddresses,
      getTokenTransferCountByTokenAddresses,
      getActiveUsersByTokenAddress,
      getNewUsersByTokenAddress,
      getUniqueSendersByTokenAddress,
      getUniqueReceiversUsersByTokenAddress,
      getHolderGrowthByTokenAddress,
    };
  })();

  const aggregated = (() => {
    /**
     * Get transaction count grouped by to addresses in last 24 hours
     */
    const getTxnCountByToAddresses = async (
      toAddresses: {
        address: string;
        label: string;
      }[],
    ) => {
      const sql = `
        SELECT
            CASE
              ${toAddresses.map(({ address, label }) => `WHEN LOWER(t.to_address) = '${address.toLowerCase()}' THEN '${label}'`).join(" ")}
            END AS label,
          COUNT(t.transaction_hash) AS tx_count
        FROM
          bigquery-public-data.goog_blockchain_ethereum_mainnet_us.transactions AS t
        WHERE
          t.block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR) 
          AND LOWER(t.to_address) IN (${toAddresses.map(({ address }) => `'${address.toLowerCase()}'`).join(",")})
        GROUP BY
          label
        ORDER BY
          tx_count DESC
      `;

      const result = await query({
        query: sql,
        useLegacySql: false,
        maximumBytesBilled: bytes("5GB")?.toString(),
      });

      type TData = {
        label: string;
        tx_count: number;
      };

      if (result.success) {
        return {
          success: true,
          data: (result.data[0] as TData[]).map(({ label, tx_count }) => ({
            label,
            txCount: tx_count,
          })),
        };
      }

      return result;
    };

    /**
     * In last 24 hours
     */
    const getTransferCountByTokenAddresses = async (
      tokens: {
        address: string;
        label: string;
      }[],
    ) => {
      const sql = `
        SELECT
          CASE
            ${tokens.map(({ label, address }) => `WHEN LOWER(token_address) = '${address.toLowerCase()}' THEN '${label}'`).join(" ")}
          END AS label,
          COUNT(transaction_hash) AS tx_count
        FROM
          bigquery-public-data.crypto_ethereum.token_transfers
        WHERE
          block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR)
          AND LOWER(token_address) IN (${tokens.map(({ address }) => `'${address.toLowerCase()}'`).join(",")})
        GROUP BY
          label
        ORDER BY
          tx_count DESC;
      `;

      const result = await query({
        query: sql,
        useLegacySql: false,
        maximumBytesBilled: bytes("5GB")?.toString(),
      });

      type TData = {
        label: string;
        tx_count: number;
      };

      if (result.success) {
        return {
          success: true,
          data: (result.data[0] as TData[]).map(({ label, tx_count }) => ({
            label,
            txCount: tx_count,
          })),
        };
      }

      return result;
    };

    return {
      getTxnCountByToAddresses,
      getTransferCountByTokenAddresses,
    };
  })();

  return {
    timeseries,
    aggregated,
  };
}
