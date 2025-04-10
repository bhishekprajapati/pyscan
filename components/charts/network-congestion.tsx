"use client";

import { Divider } from "@heroui/react";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeading,
  CardTimestamp,
} from "../ui/card";

interface CongestionData {
  date: string;
  avgGasPrice: number;
  // avg_block_utilization: number;
}

type Props = {
  data: CongestionData[];
  timestamp: number;
};

const NetworkCongestionChart: React.FC<Props> = ({ data, timestamp }) => (
  <Card className="h-full">
    <CardHeader>
      <CardHeading>Network Congestion</CardHeading>
      <CardTimestamp date={new Date(timestamp)} />
    </CardHeader>
    <Divider />
    <CardBody className="p-0">
      <ResponsiveContainer width="100%" height={150} className="relative">
        <LineChart data={data}>
          <Tooltip
            separator=" "
            wrapperClassName="!bg-default-50 rounded-lg !border-none"
            cursor={false}
            formatter={(value) => [value, "Avg Gas Price (In gwei)"]}
          />
          <Line
            type="monotone"
            dataKey="avgGasPrice"
            className="stroke-secondary"
            stroke="inherit"
            strokeWidth={1.5}
            dot={false}
            filter="url(#glow)"
          />
        </LineChart>
      </ResponsiveContainer>
    </CardBody>
  </Card>
);
export default NetworkCongestionChart;
