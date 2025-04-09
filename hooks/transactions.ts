"use client";

import type { PostTransactionCountSearchQuery } from "@/app/api/public/mainnet/analytics/transactions/counts/route";
import { client } from "@/lib/api.sdk";
import { isServer, useQuery } from "@tanstack/react-query";
import { groupBy } from "remeda";

export const useTransactionCounts = (opts: PostTransactionCountSearchQuery) => {
  const query = useQuery({
    queryKey: ["transactions-count", opts],
    queryFn: async ({ signal }) => {
      const result = await client.public.mainnet.analytics.getTxnCounts(opts, {
        signal,
      });
      if (result.ok) return result.data;
      throw Error(result.error.message);
    },
    enabled: !isServer,
    select(txns) {
      if (txns.type === "transfers") {
        const group = groupBy(txns.dataset, ({ timestamp }) => timestamp);
        return {
          type: txns.type,
          dataset: Object.entries(group).map(([timestamp, tokens]) => {
            const labels: Record<string, number> = {};
            tokens.forEach(({ label, count }) => {
              labels[label] = count;
            });
            return {
              timestamp,
              ...labels,
            };
          }),
        };
      }
      return txns;
    },
  });

  return {
    query,
  };
};
