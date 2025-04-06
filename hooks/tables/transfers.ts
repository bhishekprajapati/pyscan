"use client";

import { client } from "@/lib/api.sdk";
import { isServer, useQuery } from "@tanstack/react-query";

// TODO: fetch on 15 min intervals
export const useTransfers = () =>
  useQuery({
    queryKey: ["mainnet", "transfers"],
    queryFn: async ({ signal }) => {
      const res = await client.public.explorer.mainnet.getTransfers(
        {},
        { signal },
      );
      if (!res.ok) {
        throw Error(res.error.message);
      }
      return res.data;
    },
    enabled: !isServer,
  });
