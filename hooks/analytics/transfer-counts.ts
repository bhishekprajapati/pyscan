"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api.sdk";

export const timeframes = [
  { key: "day", label: "D" } as const,
  { key: "month", label: "M" } as const,
  { key: "year", label: "Y" } as const,
];

export type Timeframe = (typeof timeframes)[number]["key"];

export const useTransferCounts = (timeframe: Timeframe) =>
  useQuery({
    placeholderData: [
      { count: 142, date: { value: "2025-02-28" } },
      { count: 245, date: { value: "2025-03-01" } },
      { count: 424, date: { value: "2025-03-02" } },
      { count: 145, date: { value: "2025-03-03" } },
      { count: 431, date: { value: "2025-03-04" } },
      { count: 250, date: { value: "2025-03-05" } },
      { count: 143, date: { value: "2025-03-06" } },
      { count: 312, date: { value: "2025-03-07" } },
      { count: 185, date: { value: "2025-03-08" } },
      { count: 456, date: { value: "2025-03-09" } },
      { count: 81, date: { value: "2025-03-10" } },
      { count: 75, date: { value: "2025-03-11" } },
      { count: 176, date: { value: "2025-03-12" } },
      { count: 498, date: { value: "2025-03-13" } },
      { count: 215, date: { value: "2025-03-14" } },
      { count: 339, date: { value: "2025-03-15" } },
      { count: 430, date: { value: "2025-03-16" } },
      { count: 112, date: { value: "2025-03-17" } },
      { count: 255, date: { value: "2025-03-18" } },
      { count: 350, date: { value: "2025-03-19" } },
      { count: 358, date: { value: "2025-03-20" } },
      { count: 378, date: { value: "2025-03-21" } },
      { count: 336, date: { value: "2025-03-22" } },
      { count: 130, date: { value: "2025-03-23" } },
      { count: 218, date: { value: "2025-03-24" } },
      { count: 268, date: { value: "2025-03-25" } },
      { count: 61, date: { value: "2025-03-26" } },
      { count: 420, date: { value: "2025-03-27" } },
      { count: 83, date: { value: "2025-03-28" } },
      { count: 328, date: { value: "2025-03-29" } },
    ],
    queryKey: ["mainnet", "analytics", "transfer-count", timeframe],
    queryFn: async ({ signal }) => {
      const res =
        await client.public.explorer.mainnet.analytics.getTransfersCount(
          {
            timeframe,
          },
          {
            signal,
          },
        );
      if (!res.ok) {
        throw Error(res.error.message);
      }
      return res.data;
    },
    // enabled: !isServer,
    enabled: false,
  });
