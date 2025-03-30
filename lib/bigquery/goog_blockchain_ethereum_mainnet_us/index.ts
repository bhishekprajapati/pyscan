import { z } from "zod";
import { result } from "@/utils/misc";
import { address, order } from "./schema";
import { data, error } from "../helper";
import type { QueryHandler } from "../query-handler";
import type { BigQueryTimestamp } from "@google-cloud/bigquery";

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
        block_timestamp: Pick<BigQueryTimestamp, "value">;
        transaction_hash: string;
        event_hash: string;
        from_address: string;
        to_address: string;
        quantity: string;
        event_index: number;
      };

      const res = await query({
        query: `
          SELECT block_number, block_timestamp, transaction_hash, from_address, event_hash, to_address, quantity, event_index
          FROM bigquery-public-data.goog_blockchain_ethereum_mainnet_us.token_transfers
          WHERE LOWER(address) = LOWER(@address) AND  block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR)
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

  const getGasTrend = (() => {})();

  return {
    getTransactions,
    getTokenTransfers,
    getTopHolders,
    getTokenTransferCount,
    getGasTrend,
  };
}
