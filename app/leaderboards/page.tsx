import { ComponentErrorFallback } from "@/components/errors";
import { SuspendedComponentFallback } from "@/components/fallback";
import LeaderboardTable, {
  LeaderboardTableProps,
} from "@/components/tables/leaderboard";
import { PRIMARY_TOKEN_TYPE } from "@/constants/stablecoins";
import {
  getCachedTopBurnersByTokenAddress,
  getCachedTopHoldersByTokenAddress,
  getCachedTopReceiversByTokenAddress,
  getCachedTopSendersByTokenAddress,
} from "@/lib/leaderboards";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { formatUnits } from "viem";

type LeaderBoardProps = Pick<LeaderboardTableProps, "freshness" | "heading"> & {
  fetcher: (tokenAddress: string) => Promise<{
    data: { address: string; totalRawValue: string }[];
    timestamp: number;
  }>;
};

const LeaderBoard = async (props: LeaderBoardProps) => {
  const { fetcher, ...rest } = props;
  const { data, timestamp } = await fetcher(
    PRIMARY_TOKEN_TYPE.getContractAddress(),
  );

  const formatted = data.map(({ address, totalRawValue }) => {
    const subunits = PRIMARY_TOKEN_TYPE.getSubunits();
    const value = formatUnits(BigInt(totalRawValue), subunits);
    return {
      address,
      value: `${value} ${PRIMARY_TOKEN_TYPE.getSymbol()}`,
    };
  });

  return (
    <LeaderboardTable
      data={formatted}
      timestamp={new Date(timestamp).toISOString()}
      {...rest}
    />
  );
};

export default function leaderboards() {
  return (
    <div className="m-4 grid auto-rows-auto gap-4 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <Suspense fallback={<SuspendedComponentFallback />}>
            <LeaderBoard
              fetcher={getCachedTopHoldersByTokenAddress}
              heading="Top Holders"
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className="lg:col-span-6">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <Suspense fallback={<SuspendedComponentFallback />}>
            <LeaderBoard
              fetcher={getCachedTopBurnersByTokenAddress}
              heading="Top Burners"
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className="lg:col-span-6">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <Suspense fallback={<SuspendedComponentFallback />}>
            <LeaderBoard
              fetcher={getCachedTopReceiversByTokenAddress}
              heading="Top Receivers"
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className="lg:col-span-6">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <Suspense fallback={<SuspendedComponentFallback />}>
            <LeaderBoard
              fetcher={getCachedTopSendersByTokenAddress}
              heading="Top Senders"
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
