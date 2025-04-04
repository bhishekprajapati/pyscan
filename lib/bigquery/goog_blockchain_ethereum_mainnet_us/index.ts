import { z } from "zod";
import { result } from "@/utils/misc";
import { address, order } from "./schema";
import { data, error } from "../helper";
import type { QueryHandler } from "../query-handler";
import type { BigQueryDate, BigQueryTimestamp } from "@google-cloud/bigquery";
import { Address } from "viem";

const limit = z.enum(["10", "25", "50", "100"]);

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

  const getTokenTransferCount = (() => {
    const address = z.string().min(1);
    const schema = z.object({
      address,
      timeframe: z.enum(["day", "month", "year"]),
    });

    async function queryFn(param: z.infer<typeof schema>, validate = true) {
      if (validate) {
        const validation = schema.safeParse(param);
        if (!validation.success) {
          return error({
            reason: "failed validation",
            retry: true,
            isInternal: false,
            error: validation.error,
          });
        }
        param = validation.data;
      }
      const { address, timeframe } = param;

      const sql = {
        day: `
          SELECT COUNT(*) as count, DATE(block_timestamp) as date 
          FROM bigquery-public-data.goog_blockchain_ethereum_mainnet_us.token_transfers
          WHERE LOWER(address) = LOWER(@address) AND  block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 180 DAY)
          GROUP BY date
          ORDER BY date DESC
        `,
        month: `
          SELECT 
            COUNT(*) AS count, 
            FORMAT_DATE('%Y-%m-01', DATE(block_timestamp)) AS date 
          FROM bigquery-public-data.goog_blockchain_ethereum_mainnet_us.token_transfers
          WHERE 
            LOWER(address) = LOWER(@address) 
            AND DATE(block_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH) 
          GROUP BY date
          ORDER BY date DESC;
        `,
        year: `
          SELECT 
            COUNT(*) AS count, 
            FORMAT_DATE('%Y-01-01', DATE(block_timestamp)) AS date 
          FROM bigquery-public-data.goog_blockchain_ethereum_mainnet_us.token_transfers
          WHERE 
            LOWER(address) = LOWER(@address) 
            AND DATE(block_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 5 Year) 
          GROUP BY date
          ORDER BY date DESC;        
        `,
      } as const;

      const res = await query({
        query: sql[timeframe],
        params: {
          address,
        },
      });

      if (res.success)
        return data(
          res.data[0] as { count: number; date: { value: string } }[],
        );
      return res;
    }

    return queryFn;
  })();

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

  const getBlocks = (() => {
    const schema = z.object({
      limit: limit.default("25"),
      cursor: z.string().datetime().default(new Date().toISOString()),
    });

    async function queryFn(param: z.infer<typeof schema>) {
      const validation = schema.safeParse(param);

      if (!validation.success) {
        return error({
          reason: "validation-failed",
          retry: true,
          isInternal: false,
          error: validation.error,
        });
      }

      const { data } = validation;
      const { limit, cursor } = data;

      const result = await query({
        query: `
          SELECT
            block_number,
            block_timestamp,
            transaction_count,
            miner,
            gas_used,
            gas_limit,
            base_fee_per_gas,
          FROM bigquery-public-data.goog_blockchain_ethereum_mainnet_us.blocks
          WHERE DATE(block_timestamp) >= 
              DATE_TRUNC(COALESCE(DATE(TIMESTAMP(@cursor)), CURRENT_DATE()), MONTH)
            AND DATE(block_timestamp) < 
              DATE_ADD(DATE_TRUNC(COALESCE(DATE(TIMESTAMP(@cursor)), CURRENT_DATE()), MONTH), INTERVAL 1 MONTH)
            AND (block_timestamp < TIMESTAMP(@cursor) OR @cursor IS NULL)  -- Cursor logic
          ORDER BY block_timestamp DESC
          LIMIT @limit
        `,
        params: {
          limit: Number(limit),
          cursor,
        },
      });

      if (!result.success) return result;

      type TData = {
        block_number: number;
        block_timestamp: {
          value: string;
        };
        transaction_count: number;
        miner: string;
        gas_used: number;
        gas_limit: number;
        base_fee_per_gas: number;
      };

      return {
        success: result.success,
        data: result.data[0] as TData[],
      };
    }

    return queryFn;
  })();

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
    getTransactions,
    getTokenTransfers,
    getTopHolders,
    getTokenTransferCount,
    getTransactionsByAddress,
    getBlocks,
    getBlocksCount,
    getNetworkGasTrend,
    getPyusdGasTrend,
  };
}
