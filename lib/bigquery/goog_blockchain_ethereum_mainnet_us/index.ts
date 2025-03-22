import { z } from "zod";
import { result, withMeta } from "@/utils/misc.js";
import { address, order } from "./schema.js";
import { data, error } from "../helper.js";
import type { QueryHandler } from "../query-handler.js";

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

    return withMeta(queryFn, {
      optionsSchema,
    });
  })();

  const getGasTrend = (() => {})();

  return {
    getTransactions,
    getGasTrend,
  };
}
