"use client";

import type { Address } from "viem";
import { useQuery } from "@tanstack/react-query";

export const useTokenTransfersByAddress = (address: Address) =>
  useQuery({
    queryKey: ["address", "token-transfers", address],
    queryFn: async ({ signal }) => {},
  });

export const useTransactionByAddress = (address: Address) =>
  useQuery({
    queryKey: ["address", "transactions", address],
    queryFn: async ({ signal }) => {},
  });
