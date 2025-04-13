"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTimestamp,
} from "@/components/ui/card";
import { usePrimaryTokenType } from "@/hooks/tokens";
import { useTokenTransferVol } from "@/hooks/volume";
import { sortByDate } from "@/utils";
import { formatNumber } from "@/utils/chart";
import { Divider } from "@heroui/react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CurveTypeSelect, {
  useSelectedCurveType,
} from "../select/curve-type-select";

const TokenTransferVolume = () => {
  const token = usePrimaryTokenType();
  const color = token.getColors("dark").background;
  const { query } = useTokenTransferVol({
    tokenAddress: token.getContractAddress(),
    filter: {
      timeframe: "1d",
      limit: 15,
    },
  });
  const [curve, registerCurve] = useSelectedCurveType();

  // TODO: add timeframe
  // TODO: account price in usd
  const data = useMemo(() => {
    if (!query.data) return query.data;
    const { dataset, timestamp } = query.data;
    return {
      timestamp,
      dataset: dataset
        .map(({ timestamp, totalValue, txCount }) => ({
          timestamp: new Date(timestamp),
          totalValue: token.applySubunits(totalValue),
          txCount,
        }))
        .sort(sortByDate),
    };
  }, [query.data, token]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardHeading>Token Transfer Volume</CardHeading>
        {data?.timestamp && (
          <CardTimestamp
            date={new Date(data.timestamp)}
            isRefreshing={query.isFetching}
          />
        )}
      </CardHeader>
      <Divider />
      <CardBody className="p-0">
        <ResponsiveContainer height={400}>
          <AreaChart data={data?.dataset ?? []}>
            <defs>
              <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.09} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
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
                    y={y + 15}
                    textAnchor="middle"
                    fill="#aaa"
                    fontSize={12}
                  >
                    {date}
                  </text>
                );
              }}
            />
            <YAxis
              dataKey="totalValue"
              orientation="right"
              axisLine={{
                stroke: "#eeeeee50",
                strokeWidth: 0.5,
              }}
              tickFormatter={(v) => formatNumber(v)}
            />
            <Tooltip
              separator=" "
              wrapperClassName="!bg-default-50 rounded-lg !border-none"
              cursor={false}
              labelFormatter={(label: string) => new Date(label).toDateString()}
            />
            <Area
              type={curve}
              dataKey="totalValue"
              stroke={color}
              strokeWidth={2}
              fill="url(#vol)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
      <Divider />
      <CardFooter>
        <CurveTypeSelect {...registerCurve} />
      </CardFooter>
    </Card>
  );
};

export default TokenTransferVolume;
