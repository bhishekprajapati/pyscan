"use client";

import { useGasFee } from "@/hooks/gas";
import {
  ChartCard,
  ChartCardBody,
  ChartCardHeader,
  ChartCardHeading,
} from "../card";

const GasFeeTrend = () => {
  const query = useGasFee();

  return (
    <ChartCard>
      <ChartCardHeader>
        <ChartCardHeading>Gas Fee</ChartCardHeading>
      </ChartCardHeader>
      <ChartCardBody></ChartCardBody>
    </ChartCard>
  );
};
export default GasFeeTrend;
