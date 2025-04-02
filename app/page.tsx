import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
} from "@heroui/react";
import NetworkCongestionChart from "@/components/charts/network-congestion";
import { CONTRACT_ADDRESS } from "@/constants/pyusd";
import { Suspense } from "react";
import ethereum from "@/lib/ethereum";
import { ArrowRight, Box, ReceiptText } from "lucide-react";
import Timestamp from "@/components/timestamp";
import LinkButton from "@/components/ui/link-button";
import {
  AddressLink,
  BlockLink,
  BlockTransactionsLink,
  TransactionLink,
} from "@/components/links";
import { FMono, TextTruncate } from "@/components/text";
import CopyButton from "@/components/copy-button";

const Overview = () => (
  <div className="md:flex">
    <div className="flex-[0.25] border-e border-e-divider">
      <div className="h-full md:flex md:flex-col">
        <div className="m-1 flex-1 bg-secondary bg-opacity-[0.02] p-4">
          <h3 className="text-foreground-500">Max Total Supply</h3>
          <p className="mb-4">672,119,685.918257 PYUSD</p>
          <h3 className="text-foreground-500">Holders</h3>
          <p className="mb-4">26,148</p>
          <h3 className="text-foreground-500">Total Transfers</h3>
          <p className="mb-4">More than 585,463</p>
        </div>
        <Divider />
        <div className="m-1 flex-1 bg-default p-4">
          <h3 className="text-foreground-500">OnChain Market Cap</h3>
          <p className="mb-4">$672,119,685.92</p>
          <h3 className="text-foreground-500">Circulating Supply Market Cap</h3>
          <p className="mb-4">$803,035,299.00</p>
        </div>
        <Divider />
        <div className="m-1 flex-1 p-4">
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

const LatestBlocks = async () => {
  const results = await ethereum.mainnet.getLatestBlocks();
  if (!results.success) return <>errro occured</>;
  const blocks = results.data;

  return (
    <Card>
      <CardHeader className="bg-default p-6 text-default-foreground">
        <h2 className="font-serif text-xl font-bold">Latest Blocks</h2>
      </CardHeader>
      <Divider />
      <CardBody className="bg-default/50 p-0 text-default-foreground">
        <ul className="[&>:not(:last-child)]:border-b [&>:not(:last-child)]:border-b-divider">
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
    <Card>
      <CardHeader className="bg-default p-6 text-default-foreground">
        <h2 className="font-serif text-xl font-bold">Latest Transactions</h2>
      </CardHeader>
      <Divider />
      <CardBody className="bg-default/50 p-0 text-default-foreground">
        <ul className="[&>:not(:last-child)]:border-b [&>:not(:last-child)]:border-b-divider">
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
      <div className="m-4 flex flex-col gap-6 md:m-0 md:flex-row md:gap-0 md:[&>*]:flex-1">
        <div className="md:border-e md:border-divider">
          <div className="md:m-4">
            <Suspense>
              <LatestBlocks />
            </Suspense>
          </div>
        </div>
        <div>
          <div className="md:m-4">
            <Suspense>
              <LatestTransactions />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
