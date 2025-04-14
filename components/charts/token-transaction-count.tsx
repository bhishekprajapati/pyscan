"use client";

import TimeframeSelect from "@/components/select/timeframe-select";
import TokenSelect from "@/components/select/token-select";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeading,
  CardHelp,
  CardTimestamp,
} from "@/components/ui/card";
import { useSelectedTimeframe, useTimeframeMaxLimit } from "@/hooks/timeframe";
import { useSelectedTokenTypes } from "@/hooks/tokens";
import { useTransactionCounts } from "@/hooks/transactions";
import { CardFooter, Divider, Tooltip as HTooltip } from "@heroui/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CurveTypeSelect, {
  useSelectedCurveType,
} from "../select/curve-type-select";
import { formatNumber } from "@/utils/chart";
import DownloadButton from "../download-button";
import { Download } from "lucide-react";

const TokenTransactionCount = () => {
  const [tf, registerTimeframes] = useSelectedTimeframe();
  const [tokens, registerTokens] = useSelectedTokenTypes();
  const limit = useTimeframeMaxLimit(tf);
  const [curve, registerCurve] = useSelectedCurveType("step");

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

  return (
    <Card className="h-full">
      <CardHeader>
        <CardHeading>Transfer Transaction Count</CardHeading>
        {query.data?.timestamp && (
          <CardTimestamp
            date={new Date(query.data.timestamp)}
            isRefreshing={query.isFetching}
          />
        )}
        <CardHelp
          tooltipProps={{
            content:
              "Token Transaction Count tracks the number of on-chain transfers for the selected token. Use it to compare activity levels across different stablecoins and understand usage patterns beyond just volume.",
          }}
        />
      </CardHeader>
      <Divider />
      <CardBody className="relative h-[25rem] p-0">
        <img
          src="/logo.png"
          className="absolute left-[50%] top-[50%] w-[40%] -translate-x-[50%] -translate-y-[50%] opacity-5"
          alt="watermark"
        />
        {query.data && (
          <ResponsiveContainer width="100%" height={400}>
            {query.data && query.data.type === "any" ? (
              <LineChart data={query.data.dataset}>
                <Line dataKey="count" />
              </LineChart>
            ) : (
              <AreaChart data={query.data.dataset}>
                <YAxis
                  orientation="right"
                  axisLine={{
                    stroke: "#eeeeee50",
                    strokeWidth: 0.5,
                  }}
                  tickFormatter={(v) => formatNumber(v)}
                />
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
                    type={curve}
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
                <CartesianGrid
                  stroke="#eeeeee25"
                  strokeWidth="0.5"
                  strokeDasharray="3 3"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </CardBody>
      <Divider />
      <CardFooter className="gap-2">
        {query.data?.timestamp && (
          <HTooltip
            className="max-w-32"
            content="Download chart data in csv, the csv file can be imported in google sheets also"
          >
            <span className="inline-block">
              <DownloadButton
                className="ms-auto"
                data={query.data.dataset}
                filename={`transfer-transaction-count-data-${tokens.map((tk) => tk.getSymbol()).join("-")}.csv`}
                isIconOnly
                size="sm"
                variant="faded"
              >
                <Download size={16} />
              </DownloadButton>
            </span>
          </HTooltip>
        )}
        <CurveTypeSelect {...registerCurve} />
        <TimeframeSelect
          className="ms-auto"
          variant="bordered"
          {...registerTimeframes}
        />
        <TokenSelect {...registerTokens} />
      </CardFooter>
    </Card>
  );
};

export default TokenTransactionCount;
