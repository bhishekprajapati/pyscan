"use client";

import api from "@/lib/api-sdk";
import { isServer, useQuery } from "@tanstack/react-query";

import { TokenType } from "@/lib/token";

export const useSenderLeaderboard = (tokenType: TokenType<string>) => {
  const query = useQuery({
    enabled: !isServer,
    queryKey: ["sender-leaders", tokenType.getContractAddress()],
    queryFn: async ({ signal }) => {
      const result = await api.public.leaderboards.getSenderLeaderboardVol(
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
      const result = await api.public.leaderboards.getRecieverLeaderboardVol(
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
