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
import type { SerializedTokenData } from "@/lib/token";
import { Divider, Tooltip as HTooltip } from "@heroui/react";
import {
  Area,
  AreaChart,
  AreaProps,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CurveTypeSelect, {
  useSelectedCurveType,
} from "../select/curve-type-select";
import { useMemo } from "react";
import DownloadButton from "../download-button";
import { Download } from "lucide-react";

export type TokenUsersCountChartProps = {
  data: {
    date: string;
    count: number;
  }[];
  timestamp?: string | undefined;
  frequency?: number;
  heading: string | React.ReactNode;
  freshness?: string;
  token: SerializedTokenData;
  tick?: {
    dateOptions?: Intl.DateTimeFormatOptions;
  };
  area?: Pick<AreaProps, "stroke" | "name">;
  footerEndContent?: React.ReactNode;
  helpText?: string;
  filename?: string;
};

const TokenUsersCountChart: React.FC<TokenUsersCountChartProps> = (props) => {
  const {
    data,
    timestamp,
    frequency,
    heading,
    freshness,
    token,
    tick,
    area,
    footerEndContent,
    helpText,
    filename,
  } = props;

  const [curve, register] = useSelectedCurveType();
  const sorted = useMemo(
    () =>
      data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [data],
  );

  return (
    <Card>
      <CardHeader>
        <CardHeading>{heading}</CardHeading>
        {freshness && <span className="text-default-400">{freshness}</span>}
        {timestamp && (
          <CardTimestamp date={new Date(timestamp)} frequency={frequency} />
        )}
        {helpText && <CardHelp tooltipProps={{ content: helpText }} />}
      </CardHeader>
      <Divider />
      <CardBody className="relative p-0">
        <img
          src="/logo.png"
          className="absolute left-[50%] top-[50%] w-[40%] max-w-96 -translate-x-[50%] -translate-y-[50%] opacity-[0.04]"
          alt="watermark"
        />
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={sorted}>
            <YAxis
              dataKey="count"
              orientation="right"
              axisLine={{
                stroke: "#eeeeee50",
                strokeWidth: 0.5,
              }}
            />
            <XAxis
              dataKey="date"
              axisLine={{
                stroke: "#eeeeee50",
                strokeWidth: 0.5,
              }}
              tick={({ x, y, payload }) => {
                const date = new Date(payload.value).toLocaleDateString(
                  "en-US",
                  tick?.dateOptions ?? {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                  },
                );
                return (
                  <text
                    key={date}
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
              type={curve}
              dataKey="count"
              stroke={token.colors.dark.background}
              strokeWidth={2}
              dot={false}
              fillOpacity={0.05}
              {...area}
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
            <CartesianGrid
              stroke="#eeeeee25"
              strokeWidth="0.5"
              strokeDasharray="3 3"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
      <Divider />
      <CardFooter className="gap-4">
        {filename && (
          <HTooltip
            className="max-w-32"
            content="Download chart data in csv, the csv file can be imported in google sheets also"
          >
            <span className="inline-block">
              <DownloadButton
                className="ms-auto"
                data={data}
                filename={`${filename}.csv`}
                isIconOnly
                size="sm"
                variant="faded"
              >
                <Download size={16} />
              </DownloadButton>
            </span>
          </HTooltip>
        )}
        <CurveTypeSelect {...register} />
        {footerEndContent}
      </CardFooter>
    </Card>
  );
};

export default TokenUsersCountChart;
