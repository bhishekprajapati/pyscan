"use client";

import type { PostMintBurnSearchQuery } from "@/app/api/public/mainnet/analytics/volumes/mint-burn/route";
import type { PostTokenTransferVolumeSearchQuery } from "@/app/api/public/mainnet/analytics/volumes/transfers/route";
import { client } from "@/lib/api.sdk";
import { TokenType } from "@/lib/token";
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

export const useSenderLeaderboard = (tokenType: TokenType<string>) => {
  const query = useQuery({
    enabled: !isServer,
    queryKey: ["sender-leaders", tokenType.getContractAddress()],
    queryFn: async ({ signal }) => {
      const result =
        await client.public.mainnet.analytics.getSenderLeaderboardVol(
          {
            tokenAddress: tokenType.getContractAddress(),
          },
          {
            signal,
          },
        );
      if (result.ok) return result.data;
      throw Error(result.error.message);
    },
    select({ dataset, timestamp }) {
      return {
        timestamp,
        dataset: dataset.map(({ address, amount }) => ({
          address,
          amount: `${tokenType.applySubunits(amount).toFixed(2)} ${tokenType.getSymbol()}`,
        })),
      };
    },
  });

  return { query };
};

export const useReceiverLeaderboard = (tokenType: TokenType<string>) => {
  const query = useQuery({
    enabled: !isServer,
    queryKey: ["reciever-leaders", tokenType.getContractAddress()],
    queryFn: async ({ signal }) => {
      const result =
        await client.public.mainnet.analytics.getRecieverLeaderboardVol(
          {
            tokenAddress: tokenType.getContractAddress(),
          },
          {
            signal,
          },
        );
      if (result.ok) return result.data;
      throw Error(result.error.message);
    },
    select({ dataset, timestamp }) {
      return {
        timestamp,
        dataset: dataset.map(({ address, amount }) => ({
          address,
          amount: `${tokenType.applySubunits(amount).toFixed(2)} ${tokenType.getSymbol()}`,
        })),
      };
    },
  });
  return { query };
};
