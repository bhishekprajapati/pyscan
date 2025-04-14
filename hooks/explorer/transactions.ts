"use client";

import api from "@/lib/api-sdk";
import { isServer, useQuery } from "@tanstack/react-query";
import type { GetTransactionQuerySchema } from "@/app/api/public/mainnet/explorer/transactions/route";
import type { GetWalletTransactionQuerySchema } from "@/app/api/public/mainnet/explorer/transactions/wallet/[id]/route";

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

export const useAddressTransactions = (
  query: GetWalletTransactionQuerySchema & { address: string },
) => {
  return useQuery({
    queryKey: ["mainnet", "address", "transactions", query],
    queryFn: async ({ signal }) => {
      const res = await api.public.explorer.getWalletTransactions(query, {
        signal,
      });
      if (!res.ok) {
        throw Error(res.error.message);
      }
      return res.data;
    },
    enabled: !isServer,
  });
};
