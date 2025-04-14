import { z } from "zod";
import { result } from "@/utils/misc";
import { address, order } from "./schema";
import { data, error } from "../helper";
import type { QueryHandler } from "../query-handler";
import type { BigQueryDate, BigQueryTimestamp } from "@google-cloud/bigquery";
import { Address } from "viem";
import analytics from "./analytics";
import explorer from "./explorer";
import leaderboards from "./leaderboards";
import bytes from "bytes";

export default function ethereumMainnet(query: QueryHandler) {
  const getTransactions = (() => {
    const optionsSchema = z.object({
      address,
      order,
      limit: z.number().gte(1).lte(10_000).default(10),
    });

    type Options = z.infer<typeof optionsSchema>;

    const queryFn = async (options: Options, validate = true) => {
      const validation = validate
        ? optionsSchema.safeParse(options)
        : data(options);

      if (!validation.success) {
        return result(
          error({
            reason: "Validation error",
            retry: true,
            error: validation.error,
            isInternal: false,
          }),
        );
      }

      const { address, limit, order } = validation.data;

      return result(
        await query({
          query: `
          SELECT transaction_hash
          FROM bigquery-public-data.goog_blockchain_ethereum_mainnet_us.transactions
          WHERE LOWER(to_address) = LOWER(@address)
            AND block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
          ORDER BY block_timestamp ${order}
          LIMIT @limit;
        `,
          params: {
            address,
            limit,
          },
        }),
      );
    };

    return queryFn;
  })();

  const getTokenTransfers = (() => {
    const queryFn = async (address: string, limit: number) => {
      type TransferRecord = {
        block_number: number;
        block_timestamp: BigQueryTimestamp;
        transaction_hash: string;
        event_hash: string;
        from_address: string;
        to_address: string;
        quantity: string;
        event_index: number;
      };

      const res = await query({
        query: `
          SELECT
            block_number,
            block_timestamp,
            transaction_hash,
            from_address,
            event_hash,
            to_address,
            quantity,
            event_index
          FROM
            bigquery-public-data.goog_blockchain_ethereum_mainnet_us.token_transfers
          WHERE
            LOWER(address) = LOWER(@address)
            AND block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR)
          ORDER BY block_timestamp DESC
          LIMIT @limit;
        `,
        params: {
          address,
          limit,
        },
      });

      if (res.success) return data(res.data[0] as TransferRecord[]);
      return res;
    };

    return queryFn;
  })();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getTopHolders = (address: string, limit: number) => {
    return query({
      query: `
        SELECT address, balance, code
        FROM bigquery-public-data.goog_blockchain_ethereum_mainnet_us.accounts_state
        LIMIT 10;
      `,
    });
  };

  const getNetworkGasTrend = async () => {
    const result = await query({
      query: `
        SELECT
          DATE(block_timestamp) AS tx_date,
          COUNT(*) AS total_txns,
          SAFE_DIVIDE(SUM(gas_price), COUNT(*)) / POWER(10,9) AS avg_gas_price_gwei,
          MAX(gas_price) / POWER(10,9) AS max_gas_price_gwei,
          MIN(gas_price) / POWER(10,9) AS min_gas_price_gwei
        FROM
          bigquery-public-data.goog_blockchain_ethereum_mainnet_us.transactions
        WHERE
          DATE(block_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY) -- Last 30 days
        GROUP BY tx_date
        ORDER BY tx_date DESC;
      `,
    });
    if (!result.success) return result;

    type TData = {
      tx_date: BigQueryDate;
      total_txns: number;
      avg_gas_price_gwei: number;
      max_gas_price_gwei: number;
      min_gas_price_gwei: number;
    };

    return data(result.data[0] as TData[]);
  };

  const getPyusdGasTrend = async () => {
    const result = await query({
      query: `
        WITH txns AS (
        SELECT
          DATE(block_timestamp) AS tx_date,
          gas_price
        FROM
          bigquery-public-data.goog_blockchain_ethereum_mainnet_us.transactions
        WHERE
          DATE(block_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY) -- Last 30 days
          AND (
            LOWER(to_address) = '0x6c3ea9036406852006290770bedfcaba0e23a0e8'
            OR LOWER(from_address) = '0x6c3ea9036406852006290770bedfcaba0e23a0e8'
          )
        )
      SELECT
        tx_date,
        COUNT(*) AS total_txns,
        SAFE_DIVIDE(SUM(gas_price), COUNT(*)) / POWER(10,9) AS avg_gas_price_gwei,
        MAX(gas_price) / POWER(10,9) AS max_gas_price_gwei,
        MIN(gas_price) / POWER(10,9) AS min_gas_price_gwei
      FROM txns
      GROUP BY tx_date
      ORDER BY tx_date DESC;
    `,
    });
    if (!result.success) return result;
    type TData = {
      tx_date: BigQueryDate;
      total_txns: number;
      avg_gas_price_gwei: number;
      max_gas_price_gwei: number;
      min_gas_price_gwei: number;
    };
    return data(result.data[0] as TData[]);
  };

  const getTransactionsByAddress = (address: Address) =>
    query({
      query: `
        SELECT
          block_number,
          block_timestamp,
          transaction_hash,
          nonce,
          from_address,
          to_address,
          value,
          gas,
          gas_price,
          transaction_type
        FROM bigquery-public-data.goog_blockchain_ethereum_mainnet_us.transactions
        WHERE
          from_address = @address OR
          to_address = @address
        ORDER BY block_timestamp DESC
        LIMIT 10;
    `,
      params: {
        address,
      },
    });

  const getBlocks = async (limit: string, cursor: string) => {
    const sql = `
      WITH filtered_blocks AS (
        SELECT *
        FROM bigquery-public-data.goog_blockchain_ethereum_mainnet_us.blocks
        WHERE DATE(block_timestamp) >= DATE_TRUNC(COALESCE(DATE(TIMESTAMP(@cursor)), CURRENT_DATE()), MONTH)
        AND DATE(block_timestamp) < DATE_ADD(DATE_TRUNC(COALESCE(DATE(TIMESTAMP(@cursor)), CURRENT_DATE()), MONTH), INTERVAL 1 MONTH)
      )
      SELECT
        block_number,
        block_timestamp,
        transaction_count,
        miner,
        gas_used,
        gas_limit,
        base_fee_per_gas,
        (SELECT COUNT(*) FROM filtered_blocks) AS total_rows
      FROM filtered_blocks
      WHERE (block_timestamp < TIMESTAMP(@cursor) OR @cursor IS NULL)
      ORDER BY block_timestamp DESC
      LIMIT @limit
    `;

    const result = await query({
      query: sql,
      params: {
        limit: Number(limit),
        cursor,
      },
      maximumBytesBilled: bytes("5GB")?.toString(),
    });

    if (!result.success) return result;

    type TData = {
      block_number: number;
      block_timestamp: BigQueryTimestamp;
      transaction_count: number;
      miner: string;
      gas_used: number;
      gas_limit: number;
      base_fee_per_gas: number;
      total_rows: number;
    };

    const dataset = result.data[0] as TData[];
    const pageSize = dataset.length;
    const totalPages = Math.ceil((dataset.at(-1)?.total_rows ?? 0) / pageSize);

    const meta = {
      cursor: dataset.at(-1)?.block_timestamp.value,
      pageSize,
      totalPages,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const rows = dataset.map(({ block_timestamp, total_rows, ...rest }) => ({
      ...rest,
      block_timestamp: block_timestamp.value,
    }));

    return {
      success: result.success,
      data: {
        rows,
        meta,
      },
    };
  };

  const getBlocksCount = async () => {
    const result = await query({
      query: `
        SELECT
          COUNT(*) as count,
        FROM bigquery-public-data.goog_blockchain_ethereum_mainnet_us.blocks
      `,
    });
    if (!result.success) return result;
    return {
      success: true as const,
      data: result.data[0],
    };
  };

  return {
    leaderboards: leaderboards(query),
    analytics: analytics(query),
    explorer: explorer(query),
    getTransactions,
    getTokenTransfers,
    getTopHolders,
    getTransactionsByAddress,
    getBlocks,
    getBlocksCount,
    getNetworkGasTrend,
    getPyusdGasTrend,
  };
}
