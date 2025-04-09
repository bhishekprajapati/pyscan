"use client";

import { useTokenTransferVolume } from "@/hooks/volume";
import {
  ChartCard,
  ChartCardBody,
  ChartCardHeader,
  ChartCardHeading,
} from "../card";

const TokenTransferVolume = () => {
  const query = useTokenTransferVolume();

  return (
    <ChartCard>
      <ChartCardHeader>
        <ChartCardHeading>Token Volume</ChartCardHeading>
      </ChartCardHeader>
      <ChartCardBody></ChartCardBody>
    </ChartCard>
  );
};

export default TokenTransferVolume;
