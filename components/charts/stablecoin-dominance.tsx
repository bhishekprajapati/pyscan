"use client";

import { CardBody, Divider } from "@heroui/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardHeader, CardHeading, CardTimestamp } from "../ui/card";

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
    <Card>
      <CardHeader>
        <CardHeading>Market Cap Dominance</CardHeading>
        <CardTimestamp date={new Date(timestamp)} />
      </CardHeader>
      <Divider />
      <CardBody>
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
      </CardBody>
    </Card>
  );
};

export default StablecoinDominanceChart;
