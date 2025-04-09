"use client";

import { usePrimaryTokenType } from "@/hooks/tokens";
import { useMintBurnVol } from "@/hooks/volume";
import {
  ChartCard,
  ChartCardBody,
  ChartCardHeader,
  ChartCardHeading,
} from "../card";
import {
  Bar,
  BarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { useMemo } from "react";
import { sortByDate } from "@/utils";

// TODO: build a custom hook to fetch primary token price in usd to show mint burn volume in usd
// TODO: add timeframe

const MintBurnChart = () => {
  const token = usePrimaryTokenType();
  const { query } = useMintBurnVol({
    tokenAddress: token.getContractAddress(),
    filter: {
      timeframe: "1d",
      limit: 30,
    },
  });

  const data = useMemo(() => {
    const data = query.data;
    if (!data) return data;
    const { dataset, timestamp } = data;
    return {
      timestamp,
      data: dataset
        .map(({ timestamp, totalValue }) => ({
          timestamp: new Date(timestamp),
          minted: token.applySubunits(totalValue.minted),
          burnt: token.applySubunits(totalValue.burnt) * -1,
        }))
        .sort(sortByDate),
    };
  }, [query.data]);

  return (
    <ChartCard>
      <ChartCardHeader>
        <ChartCardHeading>Mint Vs Burn</ChartCardHeading>
      </ChartCardHeader>
      <ChartCardBody>
        {data && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.data}>
              <XAxis
                dataKey="timestamp"
                tickCount={6}
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
              <Tooltip
                wrapperClassName="!bg-default-50 rounded-lg !border-none"
                labelFormatter={(label: string) => {
                  return new Date(label).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                  });
                }}
                cursor={false}
              />
              <Bar dataKey="minted" stroke="lightgreen" fill="lightgreen" />
              <ReferenceLine y={0} stroke="#eeeeee50" strokeWidth={1} />
              <Bar dataKey="burnt" stroke="#FFB3B3" fill="#FFB3B3" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCardBody>
    </ChartCard>
  );
};
export default MintBurnChart;
