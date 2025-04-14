"use client";

import api from "@/lib/api-sdk";
import { isServer, useQuery } from "@tanstack/react-query";
import { usePrimaryTokenType } from "../tokens";
import type { GetTransactionQuerySchema } from "@/app/api/public/mainnet/explorer/transactions/route";

export const useLatestTokenTransfer = (tokenAddress: string) => {
  const query = useQuery({
    queryKey: ["latest-token-transfer", tokenAddress],
    queryFn: async ({ signal }) => {
      const result = await api.public.explorer.getLatestTokenTransfers(
        tokenAddress,
        {
          signal,
        },
      );
      if (result.ok) {
        return result.data;
      }
      throw Error(result.error.message);
    },
    enabled: !isServer,
    refetchInterval: 4000,
  });

  return { query };
};

export const useTransactions = (query: GetTransactionQuerySchema) => {
  return useQuery({
    queryKey: ["mainnet", "transactions", query],
    queryFn: async ({ signal }) => {
      const res = await api.public.explorer.getTransactions(query, { signal });
      if (!res.ok) {
        throw Error(res.error.message);
      }
      return res.data;
    },
    enabled: !isServer,
  });
};
