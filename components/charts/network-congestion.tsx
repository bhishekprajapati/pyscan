"use client";

import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";
import TimeAgo from "react-timeago";
import { Tooltip as HTooltip } from "@heroui/react";
import { CircleHelp } from "lucide-react";
import { FMono } from "../text";

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
  <div className="h-full">
    <div className="flex items-center gap-2 border-b border-divider bg-default p-4">
      <FMono className="text-lg dark:text-default-600">
        Network Congestion
      </FMono>
      <FMono className="ms-auto dark:text-default-200">
        <TimeAgo date={new Date(timestamp)} />
      </FMono>
      <HTooltip className="max-w-64 bg-default-50" content="">
        <CircleHelp className="dark:text-default-200" size={16} />
      </HTooltip>
    </div>
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
  </div>
);
export default NetworkCongestionChart;
