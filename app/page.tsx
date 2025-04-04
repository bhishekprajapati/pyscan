export const dynamic = "force-dynamic";

import { cn } from "@heroui/react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ComponentErrorFallback } from "@/components/errors";
import { SuspendedComponentFallback } from "@/components/fallback";

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

const GridItem: React.FC<React.HTMLProps<HTMLDivElement>> = ({
  className,
  ...rest
}) => (
  <div
    className={cn("h-full overflow-hidden rounded-md p-4", className)}
    {...rest}
  />
);

/**
 * TODO: real-time update on client side
 */

export default function Home() {
  return (
    <div className="m-2 grid auto-rows-max gap-2 sm:m-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12">
      <div className="h-full sm:col-span-2 lg:col-span-4">
        <GridItem className="bg-primary-100 bg-opacity-[0.025]">
          <PyusdSupply />
        </GridItem>
      </div>

      <div className="h-full lg:col-span-4">
        <GridItem className="bg-primary-100 bg-opacity-[0.025]">
          <PyusdHolderInfo />
        </GridItem>
      </div>

      <div className="h-full lg:col-span-4">
        <GridItem className="bg-primary-100 bg-opacity-[0.025]">
          <PyusdTokenInfo />
        </GridItem>
      </div>

      <div className="h-full sm:col-span-2 lg:col-span-12 xl:col-span-8 xl:row-span-2">
        <GridItem className="bg-primary-100 bg-opacity-[0.025] p-0">
          <ErrorBoundary fallback={<ComponentErrorFallback />}>
            <PyusdVolume />
          </ErrorBoundary>
        </GridItem>
      </div>

      <div className="h-full lg:col-span-6 xl:col-span-4">
        <GridItem className="bg-primary-100 bg-opacity-[0.025] p-0">
          <ErrorBoundary fallback={<ComponentErrorFallback />}>
            <Suspense
              fallback={<SuspendedComponentFallback className="h-full" />}
            >
              <GasTrendChart />
            </Suspense>
          </ErrorBoundary>
        </GridItem>
      </div>

      <div className="h-full lg:col-span-6 xl:col-span-4">
        <GridItem className="bg-primary-100 bg-opacity-[0.025] p-0">
          <ErrorBoundary fallback={<ComponentErrorFallback />}>
            <NetworkCongestion />
          </ErrorBoundary>
        </GridItem>
      </div>

      <div className="sm:col-span-2 lg:col-span-9 xl:col-span-9">
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
      <div className="sm:col-span-2 lg:col-span-3">
        <GridItem className="bg-primary-100 bg-opacity-[0.025] p-0">
          <ErrorBoundary fallback={<ComponentErrorFallback className="p-16" />}>
            <StablecoinDominance />
          </ErrorBoundary>
        </GridItem>
      </div>

      <div className="sm:col-span-2 lg:col-span-9">
        <ErrorBoundary
          fallback={<ComponentErrorFallback className="h-[59rem]" />}
        >
          <Suspense fallback={<SuspendedComponentFallback />}>
            <LatestBlocks />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="sm:col-span-2 lg:col-span-3">
        <ErrorBoundary
          fallback={<ComponentErrorFallback className="p-16" />}
        ></ErrorBoundary>
      </div>

      <div className="sm:col-span-2 lg:col-span-12">
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
