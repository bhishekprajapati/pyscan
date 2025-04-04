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

// const PyusdDominanceTreemap = async () => {
//   const result = await getStablecoins();
//   if (!result.success) return <></>;
//   return <StablecoinTreemap data={Array.from(new Set(result.data))} />;
// };

const GridItem: React.FC<React.HTMLProps<HTMLDivElement>> = ({
  className,
  ...rest
}) => <div className={cn("h-full rounded-md p-4", className)} {...rest} />;

/**
 * TODO: real-time update on client side
 */

export default function Home() {
  return (
    <div className="m-2 grid auto-rows-max gap-2 sm:m-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12">
      <div className="h-full sm:col-span-2 lg:col-span-4">
        <GridItem className="bg-secondary bg-opacity-5">
          <PyusdSupply />
        </GridItem>
      </div>

      <div className="h-full lg:col-span-4 lg:row-start-2">
        <GridItem className="bg-default">
          <PyusdHolderInfo />
        </GridItem>
      </div>

      <div className="h-full lg:col-span-4 lg:row-start-3">
        <GridItem className="bg-default/40">
          <PyusdTokenInfo />
        </GridItem>
      </div>

      <div className="h-full sm:col-span-2 lg:col-span-8">
        <GridItem className="bg-default/40 px-0">
          <ErrorBoundary fallback={<ComponentErrorFallback />}>
            <NetworkCongestion />
          </ErrorBoundary>
        </GridItem>
      </div>

      <div className="h-full lg:col-span-4 lg:row-span-2">
        <GridItem className="bg-default/40 p-0">
          <ErrorBoundary fallback={<ComponentErrorFallback />}>
            <Suspense
              fallback={<SuspendedComponentFallback className="h-full" />}
            >
              <GasTrendChart />
            </Suspense>
          </ErrorBoundary>
        </GridItem>
      </div>

      <div className="h-full lg:col-span-4 lg:row-span-2">
        <GridItem className="bg-default/40 px-0">
          <ErrorBoundary fallback={<ComponentErrorFallback />}>
            <NetworkCongestion />
          </ErrorBoundary>
        </GridItem>
      </div>

      <div className="sm:col-span-2 lg:col-span-9">
        <ErrorBoundary
          fallback={<ComponentErrorFallback className="h-[59rem]" />}
        >
          <Suspense fallback={<SuspendedComponentFallback />}>
            <LatestPyusdTransfers />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="sm:col-span-2 lg:col-span-3">
        <ErrorBoundary
          fallback={<ComponentErrorFallback className="p-16" />}
        ></ErrorBoundary>
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
