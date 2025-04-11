"use client";

import api from "@/lib/api-sdk";
import { isServer, useQuery } from "@tanstack/react-query";

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
