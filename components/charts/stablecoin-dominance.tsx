"use client";

import { Tooltip as HTooltip } from "@heroui/react";
import { CircleHelp } from "lucide-react";
import TimeAgo from "react-timeago";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { FMono } from "../text";

type StablecoinDominanceProps = {
  data: {
    symbol: string;
    market_cap: number;
    market_cap_dominance: number;
    id: number;
    name: string;
  }[];
  timestamp: number;
};

const StablecoinDominanceChart: React.FC<StablecoinDominanceProps> = ({
  data,
  timestamp,
}) => {
  const tokens = data.map(({ market_cap, ...rest }) => ({
    ...rest,
    market_cap: Math.sqrt(Math.sqrt(market_cap)),
  }));

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#00C49F",
    "#FFBB28",
  ];

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 bg-default p-4">
        <FMono className="text-lg dark:text-default-600">PYUSD Dominance</FMono>
        <FMono className="ms-auto dark:text-default-200">
          <TimeAgo date={new Date(timestamp)} />
        </FMono>
        <HTooltip className="max-w-64 bg-default-50" content="">
          <CircleHelp className="dark:text-default-200" size={16} />
        </HTooltip>
      </div>
      <div className="p-2 md:p-4">
        <ResponsiveContainer
          width="100%"
          height={400}
          className="text-gray-100"
        >
          <PieChart width={730} height={250}>
            <Pie
              data={tokens}
              dataKey="market_cap"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="100%"
              fill="#8884d8"
            >
              {data.map((token, i) => (
                <Cell key={token.id} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              separator=" "
              wrapperClassName="!bg-default-50 rounded-lg !border-none [&_*]:!text-gray-100"
              formatter={(value) => {
                const v = Number(value);
                const marketCap = Math.pow(v, 4);
                // TODO: account for price
                // TODO: add icons on labels
                return `USD $${(marketCap / Math.pow(10, 9)).toFixed(2)}B`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StablecoinDominanceChart;
