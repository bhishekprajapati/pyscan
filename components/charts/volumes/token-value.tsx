"use client";

import { Card, CardBody, CardHeader, CardHeading } from "@/components/ui/card";
import { usePrimaryTokenType } from "@/hooks/tokens";
import { useTokenTransferVol } from "@/hooks/volume";
import { sortByDate } from "@/utils";
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
      </CardBody>
    </Card>
  );
};

export default TokenTransferVolume;
