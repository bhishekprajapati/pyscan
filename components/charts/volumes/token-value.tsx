"use client";

import { usePrimaryToken, useTokens } from "@/hooks/tokens";
import { useTokenTransferVol } from "@/hooks/volume";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartCard,
  ChartCardBody,
  ChartCardHeader,
  ChartCardHeading,
} from "../card";

const TokenTransferVolume = () => {
  const token = usePrimaryToken();
  const { query } = useTokenTransferVol({
    tokenAddress: token.contractAddress,
    filter: {
      timeframe: "1d",
      limit: 15,
    },
  });

  // TODO: add timeframe
  // TODO: bro do something about calculating subunits again and again
  // TODO: account price in usd
  const data = useMemo(() => {
    if (!query.data) return query.data;
    const { dataset, timestamp } = query.data;
    return {
      timestamp,
      dataset: dataset
        .map(({ timestamp, totalValue, txCount }) => ({
          timestamp: new Date(timestamp),
          totalValue: Math.trunc(
            Number(totalValue) / Math.pow(10, token.subunits),
          ),
          txCount,
        }))
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
    };
  }, [query.data]);

  const { getTokenColor } = useTokens();
  const color = getTokenColor(token.symbol);

  return (
    <ChartCard className="h-full">
      <ChartCardHeader>
        <ChartCardHeading>Token Transfer Volume</ChartCardHeading>
      </ChartCardHeader>
      <ChartCardBody>
        <ResponsiveContainer height={400}>
          <AreaChart data={data?.dataset ?? []}>
            <defs>
              <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.09} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="timestamp" hide />
            <YAxis hide />
            <Tooltip
              separator=" "
              wrapperClassName="!bg-default-50 rounded-lg !border-none"
              cursor={false}
              labelFormatter={(label: string) => new Date(label).toDateString()}
            />
            <Area
              type="monotone"
              dataKey="totalValue"
              stroke={color}
              strokeWidth={2}
              fill="url(#vol)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCardBody>
    </ChartCard>
  );
};

export default TokenTransferVolume;
