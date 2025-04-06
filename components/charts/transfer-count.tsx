"use client";

import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useState } from "react";

import {
  type Timeframe,
  timeframes,
  useTransferCounts,
} from "@/hooks/analytics/transfer-counts";

const TransferCountChart = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>("year");
  const query = useTransferCounts(timeframe);
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
