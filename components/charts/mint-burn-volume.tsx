"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardHeading,
  CardHelp,
  CardTimestamp,
} from "@/components/ui/card";
import { useSelectedTimeframe, useTimeframeMaxLimit } from "@/hooks/timeframe";
import { usePrimaryTokenType } from "@/hooks/tokens";
import { useMintBurnVol } from "@/hooks/volume";
import { sortByDate } from "@/utils";
import { formatNumber } from "@/utils/chart";
import { Divider, Tooltip as HTooltip } from "@heroui/react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import TimeframeSelect from "../select/timeframe-select";
import DownloadButton from "../download-button";
import { Download } from "lucide-react";

const TokenMintBurnVolume = () => {
  const token = usePrimaryTokenType();
  const [tf, registerTimeframe] = useSelectedTimeframe("1d");
  const lmt = useTimeframeMaxLimit(tf);
  const { query } = useMintBurnVol({
    tokenAddress: token.getContractAddress(),
    filter: {
      timeframe: tf,
      limit: lmt,
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
  }, [query.data, token]);

  return (
    <Card>
      <CardHeader>
        <CardHeading>Mint Vs Burn of {token.getSymbol()}</CardHeading>
        {data?.timestamp && (
          <CardTimestamp
            isRefreshing={query.isFetching}
            date={new Date(data.timestamp)}
          />
        )}
        <CardHelp
          tooltipProps={{
            content:
              "Mint vs Burn Volume shows the total amount of PYUSD minted and burned over time. This helps track supply changes — mints increase circulation, while burns reduce it — giving insight into issuance and redemption trends.",
          }}
        />
      </CardHeader>
      <Divider />
      <CardBody className="relative h-[25rem] p-0">
        <img
          src="/logo.png"
          className="absolute left-[50%] top-[50%] w-[40%] max-w-96 -translate-x-[50%] -translate-y-[50%] opacity-[0.04]"
          alt="watermark"
        />
        {data && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.data}>
              <YAxis
                domain={["dataMin", "dataMax"]}
                orientation="right"
                axisLine={{
                  stroke: "#eeeeee50",
                  strokeWidth: 0.5,
                }}
                tickFormatter={(v) => formatNumber(v)}
              />
              <XAxis
                dataKey="timestamp"
                tickCount={12}
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
                formatter={(value: number) => formatNumber(value)}
              />
              <Bar dataKey="minted" stroke="lightgreen" fill="lightgreen" />
              <ReferenceLine y={0} stroke="#eeeeee50" strokeWidth={1} />
              <Bar dataKey="burnt" stroke="#FFB3B3" fill="#FFB3B3" />
              <CartesianGrid
                stroke="#eeeeee25"
                strokeWidth="0.5"
                strokeDasharray="3 3"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardBody>
      <Divider />
      <CardFooter className="justify-between">
        {data?.data && (
          <HTooltip
            className="max-w-32"
            content="Download chart data in csv, the csv file can be imported in google sheets also"
          >
            <span className="inline-block">
              <DownloadButton
                className="ms-auto"
                data={data.data}
                filename={`mint-burn-volume-data-${token.getSymbol()}.csv`}
                isIconOnly
                size="sm"
                variant="faded"
              >
                <Download size={16} />
              </DownloadButton>
            </span>
          </HTooltip>
        )}
        <TimeframeSelect variant="bordered" {...registerTimeframe} />
      </CardFooter>
    </Card>
  );
};
export default TokenMintBurnVolume;
