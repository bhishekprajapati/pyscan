"use client";

import { CircleHelp } from "lucide-react";
import TimeAgo from "react-timeago";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip as HTooltip } from "@heroui/react";
import { FMono } from "../text";
import { PYUSDIcon } from "../icon";

type Props = {
  data: {
    date: string;
    txnCount: number;
    vol: number;
    timeframe: string;
  }[];
  price: number;
  timestamp: number;
};

const PyusdVolumeChart: React.FC<Props> = ({ data, timestamp, price }) => {
  const dataset = data.map(({ vol, ...rest }) => ({
    ...rest,
    vol: vol * price,
  }));

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 border-b border-divider bg-default p-4">
        <FMono className="inline-block text-lg dark:text-default-600">
          <PYUSDIcon className="inline-block h-6 w-6" /> PYUSD Volume
        </FMono>
        <FMono className="ms-auto dark:text-default-200">
          <TimeAgo date={new Date(timestamp)} />
        </FMono>
        <HTooltip className="max-w-64 bg-default-50" content="">
          <CircleHelp className="dark:text-default-200" size={16} />
        </HTooltip>
      </div>
      <ResponsiveContainer height={400}>
        <AreaChart data={dataset}>
          <defs>
            <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={"#AAFF00"} stopOpacity={0.05} />
              <stop offset="95%" stopColor={"#AAFF00"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" hide />
          <YAxis hide />
          <Tooltip
            separator=" "
            wrapperClassName="!bg-default-50 rounded-lg !border-none"
            cursor={false}
            formatter={(value) => [
              `$${(Number(value) / Math.pow(10, 6)).toFixed(2)} M `,
              "USD",
            ]}
            labelFormatter={(label: string) => new Date(label).toDateString()}
          />
          <Area
            type="monotone"
            dataKey="vol"
            stroke="#AAFF00"
            fill="url(#vol)"
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PyusdVolumeChart;
