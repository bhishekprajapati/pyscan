"use client";

import { CircleHelp } from "lucide-react";
import TimeAgo from "react-timeago";
import { LineChart, ResponsiveContainer } from "recharts";
import { Tooltip as HTooltip } from "@heroui/react";
import { FMono } from "../text";
import { PYUSDIcon } from "../icon";

type Props = {
  data: {}[];
  timestamp: number;
};

const PyusdVolumeChart: React.FC<Props> = ({ timestamp }) => (
  <div className="h-full">
    <div className="flex items-center gap-2 bg-default p-4">
      <FMono className="inline-block text-lg dark:text-default-600">
        <PYUSDIcon className="inline-block h-6 w-6" /> PYUSD Volume
      </FMono>
      <FMono className="ms-auto dark:text-default-200">
        <TimeAgo date={new Date(timestamp)} />
      </FMono>
      <HTooltip className="max-w-64 bg-default-50" content="">
        <CircleHelp className="dark:text-default-200" size={16} />
      </HTooltip>
    </div>
    {/* <ResponsiveContainer>
      <LineChart />
    </ResponsiveContainer> */}
  </div>
);

export default PyusdVolumeChart;
