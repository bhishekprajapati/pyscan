import { BigQueryTimestamp } from "@google-cloud/bigquery";
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
        maximumBytesBilled: bytes("5GB")?.toString(),
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

    const getTokenTransferVolumeByTokenAddress = async (
      tokenAddress: string,
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
            TIMESTAMP_TRUNC(block_timestamp, ${unit}) as timestamp,
            COUNT(*) AS tx_count,
            SUM(SAFE_CAST(value AS BIGNUMERIC)) AS total_value,
          FROM
            bigquery-public-data.crypto_ethereum.token_transfers
          WHERE
            LOWER(token_address) = LOWER(@tokenAddress) AND
            block_timestamp BETWEEN TIMESTAMP('${start}') AND TIMESTAMP ('${end}')
          GROUP BY
            timestamp
          ORDER BY
            timestamp DESC   
          LIMIT @limit
        `,
        params: {
          tokenAddress,
          limit,
        },
        useLegacySql: false,
        maximumBytesBilled: bytes("5GB")?.toString(),
      });

      type TData = {
        timestamp: BigQueryTimestamp;
        tx_count: number;
        total_value: string;
      };

      if (result.success) {
        return {
          success: result.success,
          data: (result.data[0] as TData[]).map(
            ({ timestamp, total_value, tx_count }) => ({
              timestamp: timestamp.value,
              totalValue: total_value,
              txCount: tx_count,
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

    const getHoldersCountByTokenAddress = async (
      tokenAddress: string,
      filter: Filter,
    ) => {
      const { timeframe, limit } = filter;
      const [start, end, unit] = timeseriesFilters.parsetimeframe(
        timeframe,
        limit,
      );
    };

    return {
      getTxnCount,
      getTxnCountByToAddress,
      getGasUsageByToAddress,
      getMintAndBurnVolumeByTokenAddress,
      getTokenTransferVolumeByTokenAddress,
      // getHoldersCountByTokenAddress,
      getTokenTransferCountByTokenAddresses,
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

    /**
     * This query analyzes incoming and outgoing PYUSD transactions
     * for Ethereum addresses, ranks them based on total received,
     * sent, and net activity, and identifies the most active
     * participants in the network. Useful for detecting whales,
     * high-frequency traders, or key liquidity providers.
     */
    const getAddressActivity = () => {
      const sql = `
        WITH TransferEvents AS (
          SELECT
            transaction_hash,
            block_timestamp,
            LOWER(CONCAT('0x', SUBSTR(topics[1], 27, 40))) AS from_address,
            LOWER(CONCAT('0x', SUBSTR(topics[2], 27, 40))) AS to_address,
            SAFE_CAST(FORMAT("%f", CAST(data AS FLOAT64) / POW(10, 6)) AS FLOAT64) AS amount_pyusd
          FROM
            bigquery-public-data.goog_blockchain_ethereum_mainnet_us.logs
          WHERE
            address = '0x6c3ea9036406852006290770bedfcaba0e23a0e8' -- PYUSD Contract
            AND topics[SAFE_OFFSET(0)] = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' -- Transfer Event
            AND block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 DAY)
        ),
        Incoming AS (
          SELECT
            to_address AS address,
            COUNT(*) AS incoming_transactions,
            SUM(amount_pyusd) AS incoming_pyusd
          FROM TransferEvents
          GROUP BY to_address
        ),
        Outgoing AS (
          SELECT
            from_address AS address,
            COUNT(*) AS outgoing_transactions,
            SUM(amount_pyusd) AS outgoing_pyusd
          FROM TransferEvents
          GROUP BY from_address
        )
        SELECT
          COALESCE(i.address, o.address) AS address,
          COALESCE(i.incoming_transactions, 0) AS incoming_transactions,
          COALESCE(i.incoming_pyusd, 0) AS incoming_pyusd,
          COALESCE(o.outgoing_transactions, 0) AS outgoing_transactions,
          COALESCE(o.outgoing_pyusd, 0) AS outgoing_pyusd,
          (COALESCE(i.incoming_pyusd, 0) - COALESCE(o.outgoing_pyusd, 0)) AS net_activity,
          RANK() OVER (ORDER BY COALESCE(i.incoming_pyusd, 0) DESC) AS incoming_rank,
          RANK() OVER (ORDER BY COALESCE(o.outgoing_pyusd, 0) DESC) AS outgoing_rank,
          RANK() OVER (ORDER BY (COALESCE(i.incoming_pyusd, 0) - COALESCE(o.outgoing_pyusd, 0)) DESC) AS net_activity_rank
        FROM Incoming i
        FULL OUTER JOIN Outgoing o
        ON i.address = o.address
        ORDER BY net_activity DESC
        LIMIT 10;
      `;
    };

    const getReceiverLeadersByTokenAddress = () => {};

    const getSenderLeadersByTokenAddress = () => {};

    const getHoldersByTokenAddress = () => {};

    const getHoldersCountByTokenAddress = () => {};

    return {
      getTxnCountByToAddresses,
      getTransferCountByTokenAddresses,
      // getAddressActivity,
      // getHoldersByTokenAddress,
      // getHoldersCountByTokenAddress,
      // getReceiverLeadersByTokenAddress,
      // getSenderLeadersByTokenAddress,
    };
  })();

  return {
    timeseries,
    aggregated,
  };
}
