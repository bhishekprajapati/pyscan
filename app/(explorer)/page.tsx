export const dynamic = "force-dynamic";

import { ComponentErrorFallback } from "@/components/errors";
import { SuspendedComponentFallback } from "@/components/fallback";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import GasTrendChart from "./_components/gas-trend";
import {
  LatestBlocks,
  LatestPyusdTransfers,
  LatestTransactions,
} from "./_components/latest";
import NetworkCongestion from "./_components/network-congestion";
import {
  PyusdHolderInfo,
  PyusdSupply,
  PyusdTokenInfo,
} from "./_components/pyusd";
import PyusdVolume from "./_components/pyusd-volume";
import StablecoinDominance from "./_components/stablecoin-dominance";

/**
 * TODO: real-time update on client side
 */

export default function Home() {
  return (
    <div className="m-2 grid auto-rows-max gap-2 sm:m-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12">
      <div className="h-full sm:col-span-2 lg:col-span-4">
        <PyusdSupply />
      </div>

      <div className="h-full lg:col-span-4">
        <PyusdHolderInfo />
      </div>

      <div className="h-full lg:col-span-4">
        <PyusdTokenInfo />
      </div>

      <div className="h-full sm:col-span-2 lg:col-span-12 xl:col-span-5 xl:row-span-2">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <PyusdVolume />
        </ErrorBoundary>
      </div>

      <div className="h-full lg:col-span-6 xl:col-span-4">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <Suspense
            fallback={<SuspendedComponentFallback className="h-full" />}
          >
            <GasTrendChart />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className="h-full lg:col-span-6 xl:col-span-4">
        <ErrorBoundary fallback={<ComponentErrorFallback />}>
          <NetworkCongestion />
        </ErrorBoundary>
      </div>

      <div className="sm:col-span-2 lg:col-span-9 xl:col-span-12">
        <ErrorBoundary
          fallback={<ComponentErrorFallback className="h-[59rem]" />}
        >
          <Suspense
            fallback={<SuspendedComponentFallback className="h-full" />}
          >
            <LatestPyusdTransfers />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className="sm:col-span-2 lg:col-span-3 xl:col-start-10 xl:row-span-2 xl:row-start-2">
        <ErrorBoundary fallback={<ComponentErrorFallback className="p-16" />}>
          <StablecoinDominance />
        </ErrorBoundary>
      </div>

      <div className="sm:col-span-2 lg:col-span-5">
        <ErrorBoundary
          fallback={<ComponentErrorFallback className="h-[59rem]" />}
        >
          <Suspense fallback={<SuspendedComponentFallback />}>
            <LatestBlocks />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className="sm:col-span-2 lg:col-span-7">
        <ErrorBoundary
          fallback={<ComponentErrorFallback className="h-[59rem]" />}
        >
          <Suspense fallback={<SuspendedComponentFallback />}>
            <LatestTransactions />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
