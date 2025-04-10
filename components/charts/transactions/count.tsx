"use client";

import TimeframeSelect from "@/components/select/timeframe-select";
import TokenSelect from "@/components/select/token-select";
import { Card, CardBody, CardHeader, CardHeading } from "@/components/ui/card";
import { useSelectedTimeframe, useTimeframeMaxLimit } from "@/hooks/timeframe";
import { useSelectedTokenTypes } from "@/hooks/tokens";
import { useTransactionCounts } from "@/hooks/transactions";
import { Divider } from "@heroui/react";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const TransactionCount = () => {
  const [tf, registerTimeframes] = useSelectedTimeframe();
  const [tokens, registerTokens] = useSelectedTokenTypes();
  const limit = useTimeframeMaxLimit(tf);

  const { query } = useTransactionCounts({
    type: "transfers",
    filter: {
      timeframe: tf,
      limit,
    },
    tokens: tokens.map((tk) => ({
      label: tk.getSymbol(),
      address: tk.getContractAddress(),
    })),
  });

  // TODO: fix chart un-mounting when query key changes

  return (
    <Card className="h-full">
      <CardHeader>
        <CardHeading>Transaction Count</CardHeading>
        <span className="ms-auto" />
        <TimeframeSelect variant="bordered" {...registerTimeframes} />
        <TokenSelect variant="bordered" {...registerTokens} />
      </CardHeader>
      <Divider />
      <CardBody className="p-0">
        {query.data && (
          <ResponsiveContainer width="100%" height={400}>
            {query.data && query.data.type === "any" ? (
              <LineChart data={query.data.dataset}>
                <Line dataKey="count" />
              </LineChart>
            ) : (
              <AreaChart data={query.data.dataset}>
                <XAxis
                  dataKey="timestamp"
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
                {tokens.map((tk) => (
                  <Area
                    key={tk.getSymbol()}
                    type="step"
                    name={tk.getName()}
                    dataKey={tk.getSymbol()}
                    stroke={tk.getColors("dark").background}
                    strokeWidth={2}
                    dot={false}
                    fillOpacity={0.05}
                  />
                ))}
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
            )}
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
};

export default TransactionCount;
