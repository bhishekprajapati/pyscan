"use client";

import { useGasUsage } from "@/hooks/gas";
import {
  ChartCard,
  ChartCardBody,
  ChartCardHeader,
  ChartCardHeading,
} from "../card";

const GasUsageTrend = () => {
  const query = useGasUsage();

  return (
    <ChartCard>
      <ChartCardHeader>
        <ChartCardHeading>Gas Usage</ChartCardHeading>
      </ChartCardHeader>
      <ChartCardBody></ChartCardBody>
    </ChartCard>
  );
};
export default GasUsageTrend;
