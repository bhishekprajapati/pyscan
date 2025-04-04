"use client";

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import TimeAgo from "react-timeago";
import { CircleHelp } from "lucide-react";
import { Tooltip as HTooltip } from "@heroui/react";
import { FMono } from "../text";

export type GasTrendProps = {
  data: {
    tx_date: string;
    network: {
      total_txns: number;
      avg_gas_price_gwei: number;
      max_gas_price_gwei: number;
      min_gas_price_gwei: number;
    };
    pyusd: {
      total_txns: number;
      avg_gas_price_gwei: number;
      max_gas_price_gwei: number;
      min_gas_price_gwei: number;
    };
  }[];
  timestamp: number;
};

const GasTrend: React.FC<GasTrendProps> = ({ data, timestamp }) => {
  const NETWORK_COLOR = "#C599B6";
  const PYUSD_COLOR = "#4D55CC";

  const sorted = data.sort(
    (a, b) => new Date(a.tx_date).getTime() - new Date(b.tx_date).getTime(),
  );

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 bg-default p-4">
        <FMono className="text-lg dark:text-default-600">Gas Trend</FMono>
        <FMono className="ms-auto dark:text-default-200">
          <TimeAgo date={new Date(timestamp)} />
        </FMono>
        <HTooltip
          className="max-w-64 bg-default-50"
          content="Gas trend comparison of ethereum mainnet transactions vs only pyusd transactions on ethereum mainnet. Due to limited resources the date gets updated once every 12 hours"
        >
          <CircleHelp className="dark:text-default-200" size={16} />
        </HTooltip>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={sorted}>
          <defs>
            <linearGradient id="networkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={NETWORK_COLOR} stopOpacity={0.05} />
              <stop offset="95%" stopColor={NETWORK_COLOR} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="pyusdGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={PYUSD_COLOR} stopOpacity={0.05} />
              <stop offset="95%" stopColor={PYUSD_COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis dataKey="tx_date" hide />
          <YAxis hide />
          <Tooltip
            separator=" "
            wrapperClassName="!bg-default-50 rounded-lg !border-none"
            cursor={false}
            formatter={(value, name) => {
              const v = `${value} Gwei`;
              if (name === "network.avg_gas_price_gwei") {
                return [v, "Network Avg"];
              }
              return [v, "PYUSD Avg"];
            }}
            labelFormatter={(label: string) => new Date(label).toDateString()}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="network.avg_gas_price_gwei"
            stroke={NETWORK_COLOR}
            fill="url(#networkGradient)"
            fillOpacity={1}
          />
          <Area
            type="monotone"
            dataKey="pyusd.avg_gas_price_gwei"
            stroke={PYUSD_COLOR}
            fill="url(#pyusdGradient)"
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GasTrend;
