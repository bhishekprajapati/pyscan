"use client";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeading,
  CardTimestamp,
} from "@/components/ui/card";
import type { SerializedTokenData } from "@/lib/token";
import { Divider } from "@heroui/react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export type TokenUsersCountTableProps = {
  data: {
    date: string;
    count: number;
  }[];
  timestamp?: string | undefined;
  heading: string;
  freshness?: string;
  token: SerializedTokenData;
};

const TokenUsersCountTable: React.FC<TokenUsersCountTableProps> = (props) => {
  const { data, timestamp, heading, freshness, token } = props;

  return (
    <Card>
      <CardHeader>
        <CardHeading>{heading}</CardHeading>
        {freshness && <span className="text-default-400">{freshness}</span>}
        {timestamp && <CardTimestamp date={new Date(timestamp)} />}
      </CardHeader>
      <Divider />
      <CardBody className="p-0">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <XAxis
              dataKey="date"
              axisLine={{
                stroke: "#eeeeee50",
                strokeWidth: 0.5,
              }}
              tick={({ x, y, payload }) => {
                const date = new Date(payload.value).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                  },
                );
                return (
                  <text
                    x={x}
                    y={y + 10}
                    textAnchor="middle"
                    fill="#aaa"
                    fontSize={12}
                  >
                    {date}
                  </text>
                );
              }}
            />
            <Area
              type="step"
              dataKey="count"
              stroke={token.colors.dark.background}
              strokeWidth={2}
              dot={false}
              fillOpacity={0.05}
            />
            <Tooltip
              wrapperClassName="!bg-default-50 rounded-lg !border-none"
              labelFormatter={(label: string) => {
                return new Date(label).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                });
              }}
              cursor={{
                stroke: "#eeeeee50",
                strokeWidth: 1,
                strokeDasharray: "5 5",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default TokenUsersCountTable;
