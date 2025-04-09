"use client";

import TimeframeSelect from "@/components/select/timeframe-select";
import TokenSelect from "@/components/select/token-select";
import { useHolderCounts } from "@/hooks/holders";
import { useSelectedTimeframe } from "@/hooks/timeframe";
import { useSelectedTokens } from "@/hooks/tokens";
import {
  ChartCard,
  ChartCardBody,
  ChartCardHeader,
  ChartCardHeading,
} from "../card";

const HoldersCount = () => {
  const [timeframe, registerTimeframes] = useSelectedTimeframe();
  const [tokens, registerTokens] = useSelectedTokens();
  const query = useHolderCounts();

  return (
    <ChartCard>
      <ChartCardHeader>
        <ChartCardHeading>Holders</ChartCardHeading>
        <span className="ms-auto" />
        <TimeframeSelect variant="bordered" {...registerTimeframes} />
        <TokenSelect variant="bordered" {...registerTokens} />
      </ChartCardHeader>
      <ChartCardBody></ChartCardBody>
    </ChartCard>
  );
};

export default HoldersCount;
