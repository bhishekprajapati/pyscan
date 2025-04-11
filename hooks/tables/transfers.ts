"use client";

import api from "@/lib/api-sdk";
import { isServer, useQuery } from "@tanstack/react-query";
import { usePrimaryTokenType } from "../tokens";

// TODO: fetch on 15 min intervals
export const useTransfers = () => {
  const token = usePrimaryTokenType();
  const address = token.getContractAddress();

  return useQuery({
    queryKey: ["mainnet", "transfers", address],
    queryFn: async ({ signal }) => {
      const res = await api.public.explorer.getTransfers(
        { tokenAddress: address },
        { signal },
      );
      if (!res.ok) {
        throw Error(res.error.message);
      }
      return res.data;
    },
    enabled: !isServer,
  });
};
