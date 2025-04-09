"use client";

import type { PostMintBurnSearchQuery } from "@/app/api/public/mainnet/analytics/volumes/mint-burn/route";
import type { PostTokenTransferVolumeSearchQuery } from "@/app/api/public/mainnet/analytics/volumes/transfers/route";
import { client } from "@/lib/api.sdk";
import { isServer, useQuery } from "@tanstack/react-query";

export const useMintBurnVol = (opts: PostMintBurnSearchQuery) => {
  const query = useQuery({
    enabled: !isServer,
    queryKey: ["mint-burn-volume", opts],
    queryFn: async ({ signal }) => {
      const result = await client.public.mainnet.analytics.getMintBurnVol(
        opts,
        {
          signal,
        },
      );
      if (result.ok) return result.data;
      throw Error(result.error.message);
    },
  });
  return { query };
};

export const useSenderLeaderboard = () => null;
export const useReceiverLeaderboard = () => null;

export const useTokenTransferVol = (
  opts: PostTokenTransferVolumeSearchQuery,
) => {
  const query = useQuery({
    enabled: !isServer,
    queryKey: ["token-transfer-volume", opts],
    queryFn: async ({ signal }) => {
      const result = await client.public.mainnet.analytics.getTokenTransferVol(
        opts,
        {
          signal,
        },
      );
      if (result.ok) return result.data;
      throw Error(result.error.message);
    },
  });

  return { query };
};
