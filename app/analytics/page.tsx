export const dynamic = "force-dynamic";

import TokenMintBurnVolume from "@/components/charts/mint-burn-volume";
import TokenTransactionCount from "@/components/charts/token-transaction-count";
import TokenTransferVolume from "@/components/charts/token-transfer-volume";
import TokenUsersCountTable, {
  TokenUsersCountChartProps,
} from "@/components/charts/token-users-count";
import { ComponentErrorFallback } from "@/components/errors";
import { SuspendedComponentFallback } from "@/components/fallback";
import { TokenLogo } from "@/components/token";

import { PRIMARY_TOKEN_TYPE } from "@/constants/stablecoins";
import bigquery from "@/lib/bigquery";
import { revalidate } from "@/utils/cache";
import { Chip, Tooltip } from "@heroui/react";

import { unstable_cache as cache } from "next/cache";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const { analytics } = bigquery.ethereum.mainnet;

const getCachedNewUsers = cache(
  async (address: string) => {
    const result =
      await analytics.timeseries.getNewUsersByTokenAddress(address);
    if (!result.success) {
      throw Error(result.reason);
    }
    return {
      data: result.data,
      timestamp: new Date().toISOString(),
      frequency: revalidate["10GB"],
    };
  },
  [],
  {
    revalidate: revalidate["10GB"],
  },
);

const getCachedActiveUsers = cache(
  async (address: string) => {
    const result =
      await analytics.timeseries.getActiveUsersByTokenAddress(address);
    if (!result.success) {
      throw Error(result.reason);
    }
    return {
      data: result.data,
      timestamp: new Date().toISOString(),
      frequency: revalidate["10GB"],
    };
  },
  [],
  {
    revalidate: revalidate["10GB"],
  },
);

const getCachedUniqueSendersUsers = cache(
  async (address: string) => {
    const result =
      await analytics.timeseries.getUniqueSendersByTokenAddress(address);
    if (!result.success) {
      throw Error(result.reason);
    }
    return {
      data: result.data,
      timestamp: new Date().toISOString(),
      frequency: revalidate["5GB"],
    };
  },
  [],
  {
    revalidate: revalidate["5GB"],
  },
);

const getCachedUniqueReceiversUsers = cache(
  async (address: string) => {
    const result =
      await analytics.timeseries.getUniqueReceiversUsersByTokenAddress(address);
    if (!result.success) {
      throw Error(result.reason);
    }
    return {
      data: result.data,
      timestamp: new Date().toISOString(),
      frequency: revalidate["5GB"],
    };
  },
  [],
  {
    revalidate: revalidate["5GB"],
  },
);

const getCachedHoldersGrowth = cache(
  async (address: string) => {
    const result =
      await analytics.timeseries.getHolderGrowthByTokenAddress(address);
    if (!result.success) {
      throw Error(result.reason);
    }
    return {
      data: result.data,
      timestamp: new Date().toISOString(),
      frequency: revalidate["200GB"],
    };
  },
  [],
  {
    revalidate: revalidate["200GB"],
  },
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getDummyHolderGrowth = async (address: string) => ({
  data: [
    { date: "2024-04-14", count: 1023 },
    { date: "2024-04-21", count: 1087 },
    { date: "2024-04-28", count: 1130 },
    { date: "2024-05-05", count: 1175 },
    { date: "2024-05-12", count: 1234 },
    { date: "2024-05-19", count: 1286 },
    { date: "2024-05-26", count: 1351 },
    { date: "2024-06-02", count: 1423 },
    { date: "2024-06-09", count: 1490 },
    { date: "2024-06-16", count: 1542 },
    { date: "2024-06-23", count: 1610 },
    { date: "2024-06-30", count: 1678 },
    { date: "2024-07-07", count: 1733 },
    { date: "2024-07-14", count: 1795 },
    { date: "2024-07-21", count: 1859 },
    { date: "2024-07-28", count: 1920 },
    { date: "2024-08-04", count: 1984 },
    { date: "2024-08-11", count: 2050 },
    { date: "2024-08-18", count: 2127 },
    { date: "2024-08-25", count: 2180 },
    { date: "2024-09-01", count: 2246 },
    { date: "2024-09-08", count: 2305 },
    { date: "2024-09-15", count: 2372 },
    { date: "2024-09-22", count: 2431 },
    { date: "2024-09-29", count: 2504 },
    { date: "2024-10-06", count: 2570 },
    { date: "2024-10-13", count: 2639 },
    { date: "2024-10-20", count: 2702 },
    { date: "2024-10-27", count: 2771 },
    { date: "2024-11-03", count: 2840 },
    { date: "2024-11-10", count: 2904 },
    { date: "2024-11-17", count: 2978 },
    { date: "2024-11-24", count: 3052 },
    { date: "2024-12-01", count: 3123 },
    { date: "2024-12-08", count: 3187 },
    { date: "2024-12-15", count: 3250 },
    { date: "2024-12-22", count: 3312 },
    { date: "2024-12-29", count: 3386 },
    { date: "2025-01-05", count: 3465 },
    { date: "2025-01-12", count: 3530 },
    { date: "2025-01-19", count: 3602 },
    { date: "2025-01-26", count: 3667 },
    { date: "2025-02-02", count: 3731 },
    { date: "2025-02-09", count: 3802 },
    { date: "2025-02-16", count: 3867 },
    { date: "2025-02-23", count: 3930 },
    { date: "2025-03-02", count: 3996 },
    { date: "2025-03-09", count: 4068 },
    { date: "2025-03-16", count: 4133 },
    { date: "2025-03-23", count: 4200 },
    { date: "2025-03-30", count: 4275 },
    { date: "2025-04-06", count: 4350 },
  ],
  timestamp: new Date().toISOString(),
});

type PrimaryTokenUsersCountProps = {
  fetcher: (tokenAddress: string) => Promise<{
    data: TokenUsersCountChartProps["data"];
    timestamp: string;
    frequency?: number;
  }>;
} & Omit<
  TokenUsersCountChartProps,
  "data" | "timestamp" | "frequency" | "token"
>;

const token = PRIMARY_TOKEN_TYPE;

const PrimaryTokenUsersCount = async (props: PrimaryTokenUsersCountProps) => {
  const { fetcher, ...rest } = props;
  const result = await fetcher(token.getContractAddress());
  return <TokenUsersCountTable token={token.toJSON()} {...result} {...rest} />;
};

export default function AnalyticsPage() {
  return (
    <div className="m-4 grid auto-rows-auto gap-4 lg:grid-cols-12">
      <div className="lg:col-span-12">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <Suspense fallback={<SuspendedComponentFallback className="h-72" />}>
            <PrimaryTokenUsersCount
              fetcher={
                process.env.NODE_ENV === "production"
                  ? getCachedHoldersGrowth
                  : getDummyHolderGrowth
              }
              heading={
                <>
                  <TokenLogo className="me-2 h-4 w-4" token={token.toJSON()} />{" "}
                  Holders Growth of {token.getSymbol()}
                </>
              }
              tick={{
                dateOptions: {
                  month: "short",
                  year: "2-digit",
                },
              }}
              area={{
                stroke: "lightgreen",
                name: "Holders",
              }}
              footerEndContent={
                <Tooltip content="Lifetime">
                  <Chip className="ms-auto" variant="flat">
                    ALL
                  </Chip>
                </Tooltip>
              }
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className="lg:col-span-4">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <Suspense fallback={<SuspendedComponentFallback className="h-72" />}>
            <PrimaryTokenUsersCount
              fetcher={getCachedNewUsers}
              heading={
                <>
                  <TokenLogo className="me-2 h-4 w-4" token={token.toJSON()} />{" "}
                  New Users of {token.getSymbol()}
                </>
              }
              area={{
                stroke: "violet",
                name: "New Users",
              }}
              footerEndContent={
                <Tooltip content="In last 30 days">
                  <Chip className="ms-auto" variant="flat">
                    30D
                  </Chip>
                </Tooltip>
              }
            />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="lg:col-span-4">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <Suspense fallback={<SuspendedComponentFallback className="h-72" />}>
            <PrimaryTokenUsersCount
              fetcher={getCachedActiveUsers}
              heading={
                <>
                  <TokenLogo className="me-2 h-4 w-4" token={token.toJSON()} />{" "}
                  Active Users of {token.getSymbol()}
                </>
              }
              area={{
                stroke: "#FBBF24",
                name: "Active Users",
              }}
              footerEndContent={
                <Tooltip content="In last 30 days">
                  <Chip className="ms-auto" variant="flat">
                    30D
                  </Chip>
                </Tooltip>
              }
            />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="lg:col-span-4">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <Suspense fallback={<SuspendedComponentFallback className="h-72" />}>
            <PrimaryTokenUsersCount
              fetcher={getCachedUniqueSendersUsers}
              heading={
                <>
                  <TokenLogo className="me-2 h-4 w-4" token={token.toJSON()} />{" "}
                  Unique Senders of {token.getSymbol()}
                </>
              }
              area={{
                stroke: "#ff474c",
                name: "Senders",
              }}
              footerEndContent={
                <Tooltip content="In last 30 days">
                  <Chip className="ms-auto" variant="flat">
                    30D
                  </Chip>
                </Tooltip>
              }
            />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="lg:col-span-4">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <Suspense fallback={<SuspendedComponentFallback className="h-72" />}>
            <PrimaryTokenUsersCount
              fetcher={getCachedUniqueReceiversUsers}
              heading={
                <>
                  <TokenLogo className="me-2 h-4 w-4" token={token.toJSON()} />{" "}
                  Unique Receivers of {token.getSymbol()}
                </>
              }
              area={{
                stroke: "#10B981",
                name: "Receivers",
              }}
              footerEndContent={
                <Tooltip content="In last 30 days">
                  <Chip className="ms-auto" variant="flat">
                    30D
                  </Chip>
                </Tooltip>
              }
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
            <TokenTransactionCount />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="lg:col-span-12">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <Suspense fallback={<SuspendedComponentFallback className="h-72" />}>
            <TokenMintBurnVolume />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
