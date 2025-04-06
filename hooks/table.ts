"use client";

import { isServer, useQuery } from "@tanstack/react-query";
import type { TransfersApiResponse } from "@/pages/api/mainnet/transfers";
import type { BlocksApiResponse } from "@/pages/api/mainnet/blocks";

// TODO: fetch on 15 min intervals
export const useTransfers = () =>
  useQuery({
    queryKey: ["mainnet", "transfers"],
    queryFn: async ({ signal }) => {
      const res = await fetch("/api/mainnet/transfers", {
        signal,
      });
      const json = (await res.json()) as TransfersApiResponse;
      if (!json.ok) {
        throw Error(json.error.message);
      }
      return json.data;
    },
    enabled: !isServer,
  });

type UseBlocksOptions = {
  limit?: "10" | "25" | "50" | "100";
};

export const useBlocks = (opts?: UseBlocksOptions) => {
  const { limit = "25" } = opts ?? {};
  return useQuery({
    queryKey: ["mainnet", "blocks", limit],
    queryFn: async ({ signal }) => {
      const url = `/api/mainnet/blocks?limit=${limit}`;
      const res = await fetch(url, { signal });
      const json = (await res.json()) as BlocksApiResponse;
      if (!json.ok) {
        throw Error(json.error.message);
      }
      return json.data;
    },
    enabled: !isServer,
    placeholderData: [],
  });
};

export const useTransactions = () => [];
