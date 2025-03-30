"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Select,
  SelectSection,
  SelectItem,
  Button,
} from "@heroui/react";
import { isServer, useQuery } from "@tanstack/react-query";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import type { TransferCountsApiResponse } from "@/pages/api/mainnet/analytics/transfer-counts";
import { useState } from "react";

export const timeframes = [
  { key: "day", label: "D" } as const,
  { key: "month", label: "M" } as const,
  { key: "year", label: "Y" } as const,
];

type Timeframe = (typeof timeframes)[number]["key"];

const useTransferCount = (timeframe: Timeframe) =>
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
      const res = await fetch(
        `/api/mainnet/analytics/transfer-counts?timeframe=${timeframe}`,
        {
          signal,
        },
      );
      const json = (await res.json()) as TransferCountsApiResponse;
      if (!json.ok) {
        throw Error(json.error.message);
      }
      return json.data;
    },
    // enabled: !isServer,
    enabled: false,
  });

const TransferCountChart = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>("year");
  const query = useTransferCount(timeframe);
  const data = query.data;

  return (
    <Card radius="none" shadow="none">
      <CardHeader className="justify-between border-b border-b-divider">
        <h2>Transfers Count on Ethereum</h2>
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <Button
              key={tf.key}
              className="rounded-none"
              variant={tf.key === timeframe ? "flat" : "light"}
              onPress={() => setTimeframe(tf.key)}
              isIconOnly
            >
              {tf.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="date.value" />
            <YAxis />
            <Tooltip
              wrapperClassName="!fill-zinc-900"
              labelClassName="!fill-zinc-900"
              cursor={{ className: "fill-zinc-900" }}
            />
            <Bar
              dataKey="count"
              className="fill-secondary hover:bg-background"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default TransferCountChart;
