export const dynamic = "force-dynamic";

import CopyButton from "@/components/copy-button";
import { ComponentErrorFallback } from "@/components/errors";
import { SuspendedComponentFallback } from "@/components/fallback";
import { FMono, TextTruncate } from "@/components/text";
import { Card, CardBody } from "@/components/ui/card";
import { PRIMARY_TOKEN_TYPE } from "@/constants/stablecoins";
import { TokenType } from "@/lib/token";
import { Chip } from "@heroui/react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import GasTrendChart from "./_components/gas-trend";
import {
  LatestBlocks,
  LatestPyusdTransfers,
  LatestTransactions,
} from "./_components/latest";
import NetworkCongestion from "./_components/network-congestion";
import PyusdVolume from "./_components/pyusd-volume";
import TokenDominance from "./_components/token-dominance";

type PrimaryTokenSupplyProps = { tokenType: TokenType<string> };
const PrimaryTokenSupply = async (props: PrimaryTokenSupplyProps) => {
  const { tokenType } = props;
  return (
    <Card className="h-full">
      <CardBody className="h-full">
        <div>
          <h3 className="text-foreground-500">Max Total Supply</h3>
          <p className="mb-4">
            <FMono>672,119,685.918257</FMono> PYUSD
          </p>
          <h3 className="text-foreground-500">OnChain Market Cap</h3>
          <p className="mb-4">
            <FMono>$672,119,685.92</FMono>
          </p>
          <h3 className="text-foreground-500">Circulating Supply Market Cap</h3>
          <p className="mb-4">
            <FMono>$803,035,299.00</FMono>
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

type PrimaryTokenHolderInfoProps = { tokenType: TokenType<string> };
const PrimaryTokenHolderInfo = async (props: PrimaryTokenHolderInfoProps) => {
  const { tokenType } = props;

  return (
    <Card className="h-full">
      <CardBody className="h-full">
        <div>
          <h3 className="text-foreground-500">Holders</h3>
          <p className="mb-4">
            <FMono>26,148</FMono>
          </p>
          <h3 className="text-foreground-500">Total Transfers</h3>
          <p className="mb-4">
            More than <FMono>585,463</FMono>
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

type PrimaryTokenInfoProps = { tokenType: TokenType<string> };
const PrimaryTokenInfo = (props: PrimaryTokenInfoProps) => {
  const { tokenType } = props;
  const address = tokenType.getContractAddress();

  return (
    <Card className="h-full">
      <CardBody className="h-full">
        <div>
          <h3 className="text-foreground-500">Token Contract</h3>
          <p className="mb-4 flex items-center gap-4">
            <TextTruncate className="w-[90%]">
              <FMono>{address}</FMono>
            </TextTruncate>
            <CopyButton
              value={address}
              tooltipText="Copy PYUSD contract address"
            />
          </p>
          <Chip className="me-4" variant="dot" color="primary">
            ERC-20
          </Chip>
          <Chip variant="shadow" color="primary">
            # Stablecoin
          </Chip>
        </div>
      </CardBody>
    </Card>
  );
};
/**
 * TODO: real-time update on client side
 */

export default function Home() {
  return (
    <div className="m-2 grid auto-rows-max gap-2 sm:m-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12">
      <div className="h-full sm:col-span-2 lg:col-span-4">
        <PrimaryTokenSupply tokenType={PRIMARY_TOKEN_TYPE} />
      </div>

      <div className="h-full lg:col-span-4">
        <PrimaryTokenHolderInfo tokenType={PRIMARY_TOKEN_TYPE} />
      </div>

      <div className="h-full lg:col-span-4">
        <PrimaryTokenInfo tokenType={PRIMARY_TOKEN_TYPE} />
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
          <TokenDominance />
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
