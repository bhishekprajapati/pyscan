"use client";

import { CardBody, Divider } from "@heroui/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardHeading, CardTimestamp } from "../ui/card";

export type TokenDominanceProps = {
  data: {
    quote: {
      marketCapInUsd: number;
    };
    token: {
      name: string;
      symbol: string;
      logo: string;
      color: {
        background: string;
        foreground: string;
      };
    };
  }[];
  timestamp: number;
};

const TokenDominanceChart: React.FC<TokenDominanceProps> = (props) => {
  const { data, timestamp } = props;
  const quotes = data.map(({ quote, token }) => ({
    token,
    market_cap: Math.sqrt(Math.sqrt(quote.marketCapInUsd)),
  }));

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
              data={quotes}
              dataKey="market_cap"
              nameKey="token.name"
              cx="50%"
              cy="50%"
              outerRadius="100%"
              stroke="none"
            >
              {data.map((quote) => {
                const { color, symbol } = quote.token;
                return (
                  <Cell
                    key={symbol}
                    fill={`${color.background}95`}
                    stroke={color.background}
                    strokeWidth={2}
                  />
                );
              })}
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

export default TokenDominanceChart;
