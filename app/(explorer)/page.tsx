export const dynamic = "force-dynamic";

import TokenDominanceChart, {
  TokenDominanceProps,
} from "@/components/charts/token-dominance";
import CopyButton from "@/components/copy-button";
import { ComponentErrorFallback } from "@/components/errors";
import { SuspendedComponentFallback } from "@/components/fallback";
import LatestTokenTransferTable from "@/components/tables/latest-token-transfers";
import { FMono, TextTruncate } from "@/components/text";
import { TokenLogo } from "@/components/token";
import { Card, CardBody, CardHeader, CardHeading } from "@/components/ui/card";
import LinkButton from "@/components/ui/link-button";

import { ALL_TOKEN_TYPES, PRIMARY_TOKEN_TYPE } from "@/constants/stablecoins";

import bigquery from "@/lib/bigquery";
import { getQuote } from "@/lib/coinmarketcap";
import ethereum from "@/lib/ethereum";
import { TokenType } from "@/lib/token";

import { CardFooter, Chip, Divider } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import { unstable_cache as cache } from "next/cache";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import GasTrendChart from "./_components/gas-trend";
import NetworkCongestion from "./_components/network-congestion";
import PyusdVolume from "./_components/pyusd-volume";
import LatestBlockTable from "@/components/tables/latest-blocks";

const eth = bigquery.ethereum.mainnet;

type PrimaryTokenSupplyProps = { tokenType: TokenType<string> };
const PrimaryTokenSupply = async (props: PrimaryTokenSupplyProps) => {
  const { tokenType } = props;
  return (
    <Card className="h-full">
      <CardBody className="h-full">
        <div>
          <h3 className="text-foreground-500">Max Total Supply</h3>
          <p className="mb-4">
            <FMono>672,119,685.918257</FMono> {tokenType.getSymbol()}
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            <TextTruncate className="w-[75%]">
              <FMono>{address}</FMono>
            </TextTruncate>
            <CopyButton
              value={address}
              tooltipText={`Copy ${tokenType.getSymbol()} contract address`}
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

const getTokenDominanceCachedData = cache(
  async function () {
    const tokenTypes = ALL_TOKEN_TYPES;
    const promises = await Promise.allSettled(
      tokenTypes.map(async (tk) => {
        const result = await getQuote([tk.getSymbol()]);
        if (result.success) {
          return {
            token: tk,
            quote: result.data[tk.getSymbol()],
          };
        }
        throw Error(result.err.message);
      }),
    );

    const result: TokenDominanceProps = {
      data: promises
        .filter((p) => p.status === "fulfilled")
        .map((p) => {
          const { quote, token } = p.value;
          return {
            quote: {
              marketCapInUsd: quote[0].quote.USD.market_cap,
            },
            token: {
              name: token.getName(),
              symbol: token.getSymbol(),
              color: token.getColors("dark"),
              logo: token.getLogo(),
            },
          };
        }),
      timestamp: Date.now(),
    };

    return result;
  },
  [],
  {
    revalidate: 3600,
  },
);

const TokenDominance = async () => {
  const result = await getTokenDominanceCachedData();
  return <TokenDominanceChart {...result} />;
};

type PrimaryTokenLatestTransferTableProps = {
  tokenType: TokenType<string>;
};

const PrimaryTokenLatestTransferTable = async (
  props: PrimaryTokenLatestTransferTableProps,
) => {
  const { tokenType } = props;

  const result = await eth.getTokenTransfers(
    tokenType.getContractAddress(),
    25,
  );
  if (!result.success) return <ComponentErrorFallback />;

  const txns = result.data;
  const quoteResult = await getQuote([tokenType.getSymbol()]);
  const price = quoteResult.success
    ? quoteResult.data[tokenType.getSymbol()]["0"].quote.USD.price
    : undefined;

  // TODO: switch data source to rpc provider
  return (
    <Card>
      <CardHeader>
        <TokenLogo token={tokenType.toJSON()} className="me-2" />
        <CardHeading>{tokenType.getSymbol()} Token Transfers</CardHeading>
        <span className="ms-auto" />
        <LinkButton
          className="hover:text-primary"
          // @ts-expect-error dynamic
          href={
            `/transactions/tokens/${tokenType.getContractAddress()}` as string
          }
          variant="faded"
        >
          View All
          <ArrowRight
            size={16}
            className="dark:text-gray-400 dark:group-hover:text-primary"
          />
        </LinkButton>
      </CardHeader>
      <Divider />
      <CardBody className="p-0">
        <LatestTokenTransferTable
          tokenData={tokenType.toJSON()}
          data={txns.map(({ block_timestamp, ...txn }) => ({
            block_timestamp: block_timestamp.value,
            ...txn,
          }))}
          price={price}
        />
      </CardBody>
    </Card>
  );
};

/**
 * TODO: real-time update on client side
 */
const LatestBlocks = async () => {
  const results = await ethereum.mainnet.getLatestBlocks();
  if (!results.success) return <>errro occured</>;
  const blocks = results.data;

  return (
    <Card>
      <CardHeader>
        <CardHeading>Latest Blocks</CardHeading>
      </CardHeader>
      <Divider />
      <CardBody className="p-0">
        <div className="overflow-auto">
          <LatestBlockTable blocks={blocks} />
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <LinkButton href="/blocks" variant="light" className="group">
          <span className="font-serif uppercase dark:text-gray-400 dark:group-hover:text-secondary">
            View All Blocks
          </span>
          <ArrowRight
            size={16}
            className="dark:text-gray-400 dark:group-hover:text-secondary"
          />
        </LinkButton>
      </CardFooter>
    </Card>
  );
};

export default function Home() {
  return (
    <div className="m-2 grid auto-rows-max gap-2 sm:m-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12">
      <div className="h-full sm:col-span-2 lg:col-span-4">
        <PrimaryTokenSupply tokenType={PRIMARY_TOKEN_TYPE} />
      </div>

      <div className="h-full lg:col-span-4">
        <PrimaryTokenHolderInfo tokenType={PRIMARY_TOKEN_TYPE} />
      </div>

      <div className="h-full overflow-x-auto lg:col-span-4">
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
            <PrimaryTokenLatestTransferTable tokenType={PRIMARY_TOKEN_TYPE} />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className="sm:col-span-2 lg:col-span-3 xl:col-start-10 xl:row-span-2 xl:row-start-2">
        <ErrorBoundary fallback={<ComponentErrorFallback className="p-16" />}>
          <Suspense
            fallback={<SuspendedComponentFallback className="h-full" />}
          >
            <TokenDominance />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className="sm:col-span-2 lg:col-span-12">
        <ErrorBoundary
          fallback={<ComponentErrorFallback className="h-[59rem]" />}
        >
          <Suspense
            fallback={<SuspendedComponentFallback className="h-[59rem]" />}
          >
            <LatestBlocks />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
