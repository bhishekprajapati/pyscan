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
import { usePrimaryTokenType, useSelectedTokenTypes } from "@/hooks/tokens";
import { useTokenTransferVol } from "@/hooks/volume";
import { formatNumber } from "@/utils/chart";
import { Divider, Tooltip as HTooltip } from "@heroui/react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CurveTypeSelect, {
  useSelectedCurveType,
} from "../select/curve-type-select";
import TimeframeSelect from "../select/timeframe-select";
import { useSelectedTimeframe, useTimeframeMaxLimit } from "@/hooks/timeframe";
import TokenSelect from "../select/token-select";
import { groupBy } from "lodash";
import DownloadButton from "../download-button";
import { Download } from "lucide-react";

const TokenTransferVolume = () => {
  const token = usePrimaryTokenType();
  const [curve, registerCurve] = useSelectedCurveType("step");
  const [tf, registerTimeframe] = useSelectedTimeframe();
  const [tks, registerToken] = useSelectedTokenTypes();
  const lmt = useTimeframeMaxLimit(tf);

  const { query } = useTokenTransferVol({
    tokenAddresses: tks.map((tk) => ({
      address: tk.getContractAddress(),
      label: tk.getSymbol(),
    })),
    filter: {
      timeframe: tf,
      limit: lmt,
    },
  });

  const data = useMemo(() => {
    if (!query.data) return undefined;
    const { dataset, timestamp } = query.data;
    return {
      timestamp,
      dataset: Object.entries(
        groupBy(dataset, ({ timestamp }) => timestamp),
      ).map(([timestamp, tokens]) => {
        const labels: Record<string, number> = {};
        tokens.forEach(({ label, totalValue }) => {
          const tk = tks.find((tk) => tk.getSymbol() === label);
          if (tk) {
            labels[label] = tk.applySubunits(totalValue);
          }
        });
        return { timestamp, ...labels };
      }),
    };
  }, [query.data, token]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardHeading>Token Transfer Volume</CardHeading>
        {data?.dataset && (
          <HTooltip
            className="max-w-32"
            content="Download chart data in csv, the csv file can be imported in google sheets also"
          >
            <span className="inline-block">
              <DownloadButton
                className="ms-auto"
                data={data.dataset}
                filename={`token-transfer-volume-data-${tks.map((tk) => tk.getSymbol()).join("-")}.csv`}
                isIconOnly
                size="sm"
                variant="faded"
              >
                <Download size={16} />
              </DownloadButton>
            </span>
          </HTooltip>
        )}
        {data?.timestamp && (
          <CardTimestamp
            date={new Date(data.timestamp)}
            isRefreshing={query.isFetching}
          />
        )}
        <CardHelp
          tooltipProps={{
            content:
              "Token Transfer Volume shows the total amount of PYUSD moved between addresses over time. Use this to track network activity and compare PYUSD’s usage with other stablecoins like USDT, USDC, or DAI.",
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
        <ResponsiveContainer height={400}>
          <AreaChart data={data?.dataset ?? []}>
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
              formatter={(value: number) => formatNumber(value)}
            />
            {tks.map((tk) => (
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
            <CartesianGrid
              stroke="#eeeeee25"
              strokeWidth="0.5"
              strokeDasharray="3 3"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
      <Divider />
      <CardFooter className="gap-2">
        <CurveTypeSelect className="me-auto" {...registerCurve} />
        <TimeframeSelect variant="bordered" {...registerTimeframe} />
        <TokenSelect {...registerToken} />
      </CardFooter>
    </Card>
  );
};

export default TokenTransferVolume;
