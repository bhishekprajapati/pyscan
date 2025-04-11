"use client";

import { isServer, useQuery } from "@tanstack/react-query";
import api from "@/lib/api-sdk";

type UseBlocksOptions = {
  limit?: "10" | "25" | "50" | "100";
};

export const useBlocks = (opts?: UseBlocksOptions) => {
  const { limit = "25" } = opts ?? {};
  return useQuery({
    queryKey: ["mainnet", "blocks", limit],
    queryFn: async ({ signal }) => {
      const res = await api.public.explorer.getBlocks(
        {
          limit,
        },
        { signal },
      );
      if (!res.ok) {
        throw Error(res.error.message);
      }
      return res.data;
    },
    enabled: !isServer,
    placeholderData: [],
  });
};
