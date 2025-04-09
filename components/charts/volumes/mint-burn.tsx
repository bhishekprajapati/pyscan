"use client";

import { useMintBurn } from "@/hooks/volume";
import {
  ChartCard,
  ChartCardBody,
  ChartCardHeader,
  ChartCardHeading,
} from "../card";

const MintBurnChart = () => {
  const query = useMintBurn();

  return (
    <ChartCard>
      <ChartCardHeader>
        <ChartCardHeading>Mint Vs Burn</ChartCardHeading>
      </ChartCardHeader>
      <ChartCardBody></ChartCardBody>
    </ChartCard>
  );
};
export default MintBurnChart;
