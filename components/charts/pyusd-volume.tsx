"use client";

import { Divider } from "@heroui/react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PYUSDIcon } from "../icon";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeading,
  CardTimestamp,
} from "../ui/card";

type Props = {
  data: {
    date: string;
    txnCount: number;
    vol: number;
    timeframe: string;
  }[];
  price: number;
  timestamp: number;
};

const PyusdVolumeChart: React.FC<Props> = ({ data, timestamp, price }) => {
  const dataset = data.map(({ vol, ...rest }) => ({
    ...rest,
    vol: vol * price,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <PYUSDIcon className="inline-block h-4 w-4" />
        <CardHeading>PYUSD Volume</CardHeading>
        <CardTimestamp date={new Date(timestamp)} />
      </CardHeader>
      <Divider />
      <CardBody className="h-full p-0">
        <ResponsiveContainer height={400}>
          <AreaChart data={dataset}>
            <defs>
              <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={"#AAFF00"} stopOpacity={0.05} />
                <stop offset="95%" stopColor={"#AAFF00"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Tooltip
              separator=" "
              wrapperClassName="!bg-default-50 rounded-lg !border-none"
              cursor={false}
              formatter={(value) => [
                `$${(Number(value) / Math.pow(10, 6)).toFixed(2)} M `,
                "USD",
              ]}
              labelFormatter={(label: string) => new Date(label).toDateString()}
            />
            <Area
              type="monotone"
              dataKey="vol"
              stroke="#AAFF00"
              fill="url(#vol)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default PyusdVolumeChart;
