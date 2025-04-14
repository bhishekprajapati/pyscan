import bytes from "bytes";
import { QueryHandler } from "../query-handler";
import { data, error } from "../helper";
import { BigQueryTimestamp } from "@google-cloud/bigquery";

export default function explorer(query: QueryHandler) {
  type Options = {
    date: Date;
    limit: number;
    page: number;
  };

  const getTransactionByTokenAddress = async (
    tokenAddress: string,
    opts: Options = {
      date: new Date(),
      limit: 25,
      page: 1,
    },
  ) => {
    const { date, limit, page } = opts;
    const offset = (page - 1) * limit;

    const d = date.toISOString().split("T")[0];
    const rowSql = `
      SELECT
        *
      FROM
        bigquery-public-data.goog_blockchain_ethereum_mainnet_us.token_transfers
      WHERE
        LOWER(address) = LOWER('${tokenAddress}')
        AND DATE(block_timestamp) = DATE('${d}')
      ORDER BY block_timestamp DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const countSql = `
      SELECT
        COUNT(*) AS total
      FROM
        bigquery-public-data.goog_blockchain_ethereum_mainnet_us.token_transfers
      WHERE
        LOWER(address) = LOWER('${tokenAddress}')
        AND DATE(block_timestamp) = DATE('${d}')
    `;

    const today = new Date();

    // useCache is the option date is not today's
    const shouldUseCache =
      today.toISOString().split("T")[0] !== date.toISOString().split("T")[0];

    const [rowResult, countResult] = await Promise.all([
      query({
        query: rowSql,
        useLegacySql: false,
        maximumBytesBilled: bytes("20GB")?.toString(),
        useQueryCache: shouldUseCache,
      }),
      query({
        query: countSql,
        useLegacySql: false,
        maximumBytesBilled: bytes("20GB")?.toString(),
        useQueryCache: shouldUseCache,
      }),
    ]);

    if (rowResult.success && countResult.success) {
      const rows = rowResult.data[0] as {
        block_hash: string;
        block_number: number;
        block_timestamp: BigQueryTimestamp;
        transaction_hash: string;
        transaction_index: number;
        event_index: number;
        batch_index: number | null;
        address: string;
        event_type: string;
        event_hash: string;
        event_signature: string;
        operator_address: string | null;
        from_address: string;
        to_address: string;
        token_id: string | null;
        quantity: string;
        removed: boolean;
      }[];

      const [{ total }] = countResult.data[0] as {
        total: number;
      }[];

      return data({
        data: rows.map(({ block_timestamp, ...rest }) => ({
          ...rest,
          block_timestamp: block_timestamp.value,
        })),
        meta: {
          page,
          pageSize: limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    return error({
      reason: "something went wrong",
      retry: true,
    });
  };

  return {
    getTransactionByTokenAddress,
  };
}
