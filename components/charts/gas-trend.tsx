"use client";

import { Divider } from "@heroui/react";
import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeading,
  CardHelp,
  CardTimestamp,
} from "../ui/card";

export type GasTrendProps = {
  data: {
    tx_date: string;
    network: {
      total_txns: number;
      avg_gas_price_gwei: number;
      max_gas_price_gwei: number;
      min_gas_price_gwei: number;
    };
    pyusd: {
      total_txns: number;
      avg_gas_price_gwei: number;
      max_gas_price_gwei: number;
      min_gas_price_gwei: number;
    };
  }[];
  timestamp: number;
};

const GasTrend: React.FC<GasTrendProps> = ({ data, timestamp }) => {
  const NETWORK_COLOR = "#C599B6";
  const PYUSD_COLOR = "#4D55CC";

  const sorted = data.sort(
    (a, b) => new Date(a.tx_date).getTime() - new Date(b.tx_date).getTime(),
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardHeading>Gas Trend</CardHeading>
        <CardTimestamp date={new Date(timestamp)} />
        <CardHelp
          tooltipProps={{
            content:
              "Gas trend comparison of ethereum mainnet transactions vs only pyusd transactions on ethereum mainnet. Due to limited resources the date gets updated once every 12 hours",
          }}
        />
      </CardHeader>
      <Divider />
      <CardBody className="p-0">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={sorted}>
            <defs>
              <linearGradient id="networkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={NETWORK_COLOR}
                  stopOpacity={0.05}
                />
                <stop offset="95%" stopColor={NETWORK_COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pyusdGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PYUSD_COLOR} stopOpacity={0.05} />
                <stop offset="95%" stopColor={PYUSD_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="tx_date" hide />
            <YAxis hide />
            <Tooltip
              separator=" "
              wrapperClassName="!bg-default-50 rounded-lg !border-none"
              cursor={false}
              formatter={(value, name) => {
                const v = `${value} Gwei`;
                if (name === "network.avg_gas_price_gwei") {
                  return [v, "Network Avg"];
                }
                return [v, "PYUSD Avg"];
              }}
              labelFormatter={(label: string) => new Date(label).toDateString()}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="network.avg_gas_price_gwei"
              stroke={NETWORK_COLOR}
              fill="url(#networkGradient)"
              fillOpacity={1}
            />
            <Area
              type="monotone"
              dataKey="pyusd.avg_gas_price_gwei"
              stroke={PYUSD_COLOR}
              fill="url(#pyusdGradient)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default GasTrend;
