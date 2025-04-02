import NetworkCongestionChart from "@/components/charts/network-congestion";
import CopyButton from "@/components/copy-button";
import {
  AddressLink,
  BlockLink,
  BlockTransactionsLink,
  TransactionLink,
} from "@/components/links";
import TransfersTable from "@/components/tables/transfers";
import { FMono, TextTruncate } from "@/components/text";
import Timestamp from "@/components/timestamp";
import LinkButton from "@/components/ui/link-button";
import { CONTRACT_ADDRESS } from "@/constants/pyusd";
import ethereum from "@/lib/ethereum";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Spinner,
} from "@heroui/react";
import { ArrowRight, Box, ReceiptText } from "lucide-react";
import { Suspense } from "react";

const Overview = () => (
  <div className="md:flex">
    <div className="flex-[0.25] border-e border-e-divider">
      <div className="h-full md:flex md:flex-col">
        <div className="m-2 flex-1 bg-secondary bg-opacity-5 p-4">
          <h3 className="text-foreground-500">Max Total Supply</h3>
          <p className="mb-4">
            <FMono>672,119,685.918257</FMono> PYUSD
          </p>
          <h3 className="text-foreground-500">Holders</h3>
          <p className="mb-4">
            <FMono>26,148</FMono>
          </p>
          <h3 className="text-foreground-500">Total Transfers</h3>
          <p className="mb-4">
            More than <FMono>585,463</FMono>
          </p>
        </div>
        <Divider />
        <div className="m-2 flex-1 bg-default p-4">
          <h3 className="text-foreground-500">OnChain Market Cap</h3>
          <p className="mb-4">
            <FMono>$672,119,685.92</FMono>
          </p>
          <h3 className="text-foreground-500">Circulating Supply Market Cap</h3>
          <p className="mb-4">
            <FMono>$803,035,299.00</FMono>
          </p>
        </div>
        <Divider />
        <div className="m-2 flex-1 bg-default/40 p-4">
          <div>
            <h3 className="text-foreground-500">Token Contract</h3>
            <p className="mb-4 flex items-center gap-4">
              <TextTruncate className="w-[90%]">
                <FMono>{CONTRACT_ADDRESS}</FMono>
              </TextTruncate>
              <CopyButton
                value={CONTRACT_ADDRESS}
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
        </div>
      </div>
    </div>
    <Divider className="md:hidden" />
    <div className="flex-[0.75]">
      <NetworkCongestionChart />
    </div>
  </div>
);

const ScrollContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="md:h-[50rem] md:overflow-auto">{children}</div>
);

const Fallback = () => (
  <div className="flex h-[60rem] items-center justify-center">
    <Spinner color="secondary" />
  </div>
);

const LatestBlocks = async () => {
  const results = await ethereum.mainnet.getLatestBlocks();
  if (!results.success) return <>errro occured</>;
  const blocks = results.data;

  return (
    <Card className="rounded-none">
      <CardHeader className="rounded-none bg-default p-6 text-default-foreground">
        <h2 className="font-serif text-xl font-bold">Latest Blocks</h2>
      </CardHeader>
      <Divider />
      <CardBody className="bg-default/50 p-0 text-default-foreground">
        <ScrollContainer>
          <ul className="[&>:nth-child(2n+1)]:bg-zinc-900/50">
            {blocks.map((block) => (
              <li key={block.number} className="group flex gap-4 p-4">
                <BlockLink
                  number={block.number}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-background !text-gray-300"
                >
                  <Box
                    size={24}
                    strokeWidth={1.5}
                    className="group-hover:text-primary"
                  />
                </BlockLink>
                <div>
                  <div>
                    <BlockLink number={block.number}>
                      <FMono>{block.number}</FMono>
                    </BlockLink>
                  </div>
                  <Timestamp
                    stamp={block.timestamp}
                    icon={false}
                    string={false}
                  />
                </div>
                <div>
                  <div>
                    Miner{" "}
                    <AddressLink address={block.miner}>
                      {block.ensName ? block.ensName : block.miner}
                    </AddressLink>
                  </div>
                  <BlockTransactionsLink number={block.number}>
                    {block.transactionCount}
                  </BlockTransactionsLink>{" "}
                  txns {block.duration.toString()} in secs
                </div>
              </li>
            ))}
          </ul>
        </ScrollContainer>
      </CardBody>
      <Divider />
      <CardFooter className="justify-center">
        <LinkButton href="/blocks" variant="light">
          <span className="font-serif uppercase dark:text-gray-400">
            View All Blocks
          </span>
          <ArrowRight size={16} className="dark:text-gray-400" />
        </LinkButton>
      </CardFooter>
    </Card>
  );
};

const LatestTransactions = async () => {
  const results = await ethereum.mainnet.getLatestTransactions();
  if (!results.success) return <>errro occured</>;
  const { txns, timestamp } = results.data;

  return (
    <Card className="rounded-none">
      <CardHeader className="rounded-none bg-default p-6 text-default-foreground">
        <h2 className="font-serif text-xl font-bold">Latest Transactions</h2>
      </CardHeader>
      <Divider />
      <CardBody className="bg-default/50 p-0 text-default-foreground">
        <ScrollContainer>
          <ul className="[&>:nth-child(2n+1)]:bg-zinc-900/50">
            {txns.map((txn) => (
              <li key={txn.hash} className="group flex gap-4 p-4">
                <TransactionLink
                  hash={txn.hash}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-background !text-gray-300"
                >
                  <ReceiptText
                    size={20}
                    strokeWidth={1.5}
                    className="group-hover:text-primary"
                  />
                </TransactionLink>
                <div>
                  <div>
                    <div>
                      <TransactionLink hash={txn.hash}>
                        <TextTruncate className="w-24">
                          <FMono>{txn.hash}</FMono>
                        </TextTruncate>
                      </TransactionLink>
                    </div>
                    <Timestamp stamp={timestamp} icon={false} string={false} />
                  </div>
                </div>
                <div>
                  <div>
                    From{" "}
                    <AddressLink address={txn.from}>
                      <FMono>{txn.from}</FMono>
                    </AddressLink>
                  </div>
                  {txn.to && (
                    <div>
                      To{" "}
                      <AddressLink address={txn.to}>
                        <FMono>{txn.to}</FMono>
                      </AddressLink>
                    </div>
                  )}
                </div>
                <span>{txn.value.toString()}</span>
              </li>
            ))}
          </ul>
        </ScrollContainer>
      </CardBody>
      <Divider />
      <CardFooter className="justify-center">
        <LinkButton href="/transactions" variant="light">
          <span className="font-serif uppercase dark:text-gray-400">
            View All Transactions
          </span>
          <ArrowRight size={16} className="dark:text-gray-400" />
        </LinkButton>
      </CardFooter>
    </Card>
  );
};

/**
 * TODO:
 * 1. add loading skeleton
 * 2. fix ui issues
 * 3. real-time update on client side
 */

export default function Home() {
  return (
    <div>
      <Overview />
      <Divider />
      <div>
        <TransfersTable />
      </div>
      <div className="m-2 flex flex-col gap-2 md:m-0 md:flex-row md:gap-0 md:[&>*]:flex-1">
        <div className="md:border-e md:border-divider">
          <div className="md:m-2">
            <Suspense fallback={<Fallback />}>
              <LatestBlocks />
            </Suspense>
          </div>
        </div>
        <div>
          <div className="md:m-2">
            <Suspense fallback={<Fallback />}>
              <LatestTransactions />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
