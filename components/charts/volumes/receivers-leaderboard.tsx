"use client";

import { useReceiverLeaderboard } from "@/hooks/volume";
import {
  ChartCard,
  ChartCardBody,
  ChartCardHeader,
  ChartCardHeading,
} from "../card";

const ReceiversLeaderboard = () => {
  const query = useReceiverLeaderboard();

  return (
    <ChartCard>
      <ChartCardHeader>
        <ChartCardHeading>Receivers Leaderboard</ChartCardHeading>
      </ChartCardHeader>
      <ChartCardBody></ChartCardBody>
    </ChartCard>
  );
};

export default ReceiversLeaderboard;
