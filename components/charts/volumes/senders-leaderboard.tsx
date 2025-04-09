"use client";

import { useSenderLeaderboard } from "@/hooks/volume";
import {
  ChartCard,
  ChartCardBody,
  ChartCardHeader,
  ChartCardHeading,
} from "../card";

const SendersLeaderboard = () => {
  const query = useSenderLeaderboard();

  return (
    <ChartCard>
      <ChartCardHeader>
        <ChartCardHeading>Senders Leaderboard</ChartCardHeading>
      </ChartCardHeader>
      <ChartCardBody></ChartCardBody>
    </ChartCard>
  );
};
export default SendersLeaderboard;
