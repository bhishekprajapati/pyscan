import TransactionCount from "@/components/charts/transactions/count";
import MintBurnChart from "@/components/charts/volumes/mint-burn";
import TokenTransferVolume from "@/components/charts/volumes/token-value";
import { ComponentErrorFallback } from "@/components/errors";
import { SuspendedComponentFallback } from "@/components/fallback";
import TokenUsersCountTable, {
  TokenUsersCountChartProps,
} from "@/components/charts/token-users-count";
import { PRIMARY_TOKEN_TYPE } from "@/constants/stablecoins";
import bigquery from "@/lib/bigquery";
import { unstable_cacheLife } from "next/cache";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const { analytics } = bigquery.ethereum.mainnet;

const getCachedNewUsers = async (address: string) => {
  "use cache";
  unstable_cacheLife("weeks");

  const result = await analytics.timeseries.getNewUsersByTokenAddress(address);
  if (!result.success) {
    throw Error(result.reason);
  }
  return {
    data: result.data,
    timestamp: new Date().toISOString(),
  };
};

const getCachedActiveUsers = async (address: string) => {
  "use cache";
  unstable_cacheLife("weeks");

  const result =
    await analytics.timeseries.getActiveUsersByTokenAddress(address);
  if (!result.success) {
    throw Error(result.reason);
  }
  return {
    data: result.data,
    timestamp: new Date().toISOString(),
  };
};

const getCachedUniqueSendersUsers = async (address: string) => {
  "use cache";
  unstable_cacheLife("weeks");

  const result =
    await analytics.timeseries.getUniqueSendersByTokenAddress(address);
  if (!result.success) {
    throw Error(result.reason);
  }
  return {
    data: result.data,
    timestamp: new Date().toISOString(),
  };
};

const getCachedUniqueReceiversUsers = async (address: string) => {
  "use cache";
  unstable_cacheLife("weeks");

  const result =
    await analytics.timeseries.getUniqueReceiversUsersByTokenAddress(address);
  if (!result.success) {
    throw Error(result.reason);
  }
  return {
    data: result.data,
    timestamp: new Date().toISOString(),
  };
};

type PrimaryTokenUsersCountProps = {
  fetcher: (tokenAddress: string) => Promise<{
    data: TokenUsersCountChartProps["data"];
    timestamp: string;
  }>;
} & Pick<TokenUsersCountChartProps, "heading" | "freshness">;

const PrimaryTokenUsersCount = async (props: PrimaryTokenUsersCountProps) => {
  const token = PRIMARY_TOKEN_TYPE;
  const { fetcher, ...rest } = props;
  const result = await fetcher(token.getContractAddress());
  return <TokenUsersCountTable token={token.toJSON()} {...result} {...rest} />;
};

export default function AnalyticsPage() {
  return (
    <div className="m-4 grid auto-rows-auto gap-4 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <Suspense fallback={<SuspendedComponentFallback className="h-72" />}>
            <PrimaryTokenUsersCount
              fetcher={getCachedNewUsers}
              heading="New Users"
              freshness="(Last 30 Days)"
            />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="lg:col-span-4">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <Suspense fallback={<SuspendedComponentFallback className="h-72" />}>
            <PrimaryTokenUsersCount
              fetcher={getCachedActiveUsers}
              heading="Active Users"
              freshness="(Last 30 Days)"
            />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="lg:col-span-4">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <Suspense fallback={<SuspendedComponentFallback className="h-72" />}>
            <PrimaryTokenUsersCount
              fetcher={getCachedUniqueSendersUsers}
              heading="Unique Senders"
              freshness="(Last 30 Days)"
            />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="lg:col-span-4">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <Suspense fallback={<SuspendedComponentFallback className="h-72" />}>
            <PrimaryTokenUsersCount
              fetcher={getCachedUniqueReceiversUsers}
              heading="Unique Receivers"
              freshness="(Last 30 Days)"
            />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="lg:col-span-4">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <Suspense fallback={<SuspendedComponentFallback className="h-72" />}>
            <TokenTransferVolume />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="lg:col-span-4">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <Suspense fallback={<SuspendedComponentFallback className="h-72" />}>
            <TransactionCount />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="lg:col-span-12">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <Suspense fallback={<SuspendedComponentFallback className="h-72" />}>
            <MintBurnChart />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
