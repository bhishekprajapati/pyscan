import { Chip, Divider, Tooltip } from "@heroui/react";
import { ArrowRight, Box, ReceiptText } from "lucide-react";

import { Card, CardBody, CardFooter, CardHeader } from "@/components/card";
import CopyButton from "@/components/copy-button";
import { ComponentErrorFallback } from "@/components/errors";
import { RealTimeIndicator } from "@/components/indicator";
import {
  AddressLink,
  BlockLink,
  BlockTransactionsLink,
  TransactionLink,
} from "@/components/links";
import { FMono, TextTruncate } from "@/components/text";
import Timestamp from "@/components/timestamp";
import LinkButton from "@/components/ui/link-button";

import bigquery from "@/lib/bigquery";
import { pyusd } from "@/lib/coinmarketcap";
import { microToPyusd, weiToEth } from "@/lib/converters";
import ethereum from "@/lib/ethereum";

const ScrollContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="md:h-[50rem] md:overflow-auto">{children}</div>
);

export const LatestBlocks = async () => {
  const results = await ethereum.mainnet.getLatestBlocks();
  if (!results.success) return <>errro occured</>;
  const blocks = results.data;

  return (
    <Card>
      <CardHeader>
        <h2>Latest Blocks</h2>
        <RealTimeIndicator />
      </CardHeader>
      <Divider />
      <CardBody>
        <ScrollContainer>
          <ul className="[&>:nth-child(2n+1)]:bg-zinc-900/50">
            {blocks.map((block) => (
              <li key={block.number} className="g group flex p-4">
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
                  <div className="text-sm">
                    <Timestamp
                      stamp={block.timestamp}
                      icon={false}
                      string={false}
                    />
                  </div>
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

export const LatestTransactions = async () => {
  const results = await ethereum.mainnet.getLatestTransactions();
  if (!results.success) return <>errro occured</>;
  const { txns, timestamp } = results.data;

  return (
    <Card>
      <CardHeader>
        <h2>Latest Transactions</h2>
        <RealTimeIndicator />
      </CardHeader>
      <Divider />
      <CardBody>
        <ul className="[&>:nth-child(2n+1)]:bg-zinc-900/50">
          {txns.map((txn) => (
            <li key={txn.hash} className="group flex items-center gap-4 p-4">
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
                <TransactionLink hash={txn.hash}>
                  <TextTruncate className="w-64">
                    <FMono>{txn.hash}</FMono>
                  </TextTruncate>
                </TransactionLink>
                <CopyButton text={txn.hash} />
              </div>
              <div className="me-16 text-sm">
                <Timestamp stamp={timestamp} icon={false} string={false} />
              </div>
              <AddressLink address={txn.from}>
                <FMono>{txn.from}</FMono>
              </AddressLink>
              <span className="mx-2 flex h-6 w-6 items-center justify-center rounded-full border border-secondary/15 bg-secondary/10">
                <ArrowRight size={12} className="text-secondary" />
              </span>
              {txn.to && (
                <AddressLink address={txn.to}>
                  <FMono>{txn.to}</FMono>
                </AddressLink>
              )}
              <Chip
                variant="bordered"
                className="ms-auto rounded-lg shadow-xl shadow-background/50 dark:border-gray-700/75"
              >
                <FMono>{Number(weiToEth(txn.value)).toFixed(6)} Eth</FMono>
              </Chip>
            </li>
          ))}
        </ul>
      </CardBody>
      <Divider />
      <CardFooter>
        <LinkButton href="/transactions" variant="light" className="group">
          <span className="font-serif uppercase dark:text-gray-400 dark:group-hover:text-secondary">
            View All Transactions
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

export const LatestPyusdTransfers = async () => {
  const { CONTRACT_ADDRESS } = ethereum;
  const eth = bigquery.ethereum.mainnet;
  const result = await eth.getTokenTransfers(CONTRACT_ADDRESS, 10);
  if (!result.success) return <ComponentErrorFallback />;
  const txns = result.data;
  const quoteResult = await pyusd.getQuote();
  const price = quoteResult.success
    ? quoteResult.data.PYUSD["0"].quote.USD.price
    : undefined;

  // TODO: switch data source to rpc provider
  return (
    <Card>
      <CardHeader>
        <h2>PYUSD Token Transfers</h2>
        <RealTimeIndicator />
      </CardHeader>
      <Divider />
      <CardBody>
        <ul className="[&>:nth-child(2n+1)]:bg-zinc-900/50">
          {txns.map((txn) => (
            <li
              key={txn.transaction_hash + txn.event_index}
              className="group flex items-center gap-4 p-4"
            >
              <span>
                <img src="/pyusd.webp" />
              </span>
              <div className="mx-4">
                <div>
                  <BlockLink number={BigInt(txn.block_number)}>
                    <FMono>{txn.block_number}</FMono>
                  </BlockLink>
                </div>
                <div className="text-sm">
                  <Timestamp
                    stamp={txn.block_timestamp.value}
                    icon={false}
                    string={false}
                  />
                </div>
              </div>
              <div className="me-16">
                <div className="rounded-xl border border-divider px-1">
                  <TransactionLink
                    className="align-middle"
                    hash={txn.transaction_hash}
                  >
                    <TextTruncate className="w-48">
                      <FMono>{txn.transaction_hash}</FMono>
                    </TextTruncate>
                  </TransactionLink>
                  <CopyButton text={txn.transaction_hash} />
                </div>
              </div>
              <Tooltip content="From address">
                <AddressLink address={txn.from_address}>
                  <TextTruncate className="md:w-64">
                    <FMono>{txn.from_address}</FMono>
                  </TextTruncate>
                </AddressLink>
              </Tooltip>
              <CopyButton text={txn.from_address} />
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-secondary/15 bg-secondary/10">
                <ArrowRight size={12} className="text-secondary" />
              </span>
              <Tooltip content="To address">
                <AddressLink address={txn.to_address}>
                  <TextTruncate className="md:w-64">
                    <FMono>{txn.to_address}</FMono>
                  </TextTruncate>
                </AddressLink>
              </Tooltip>
              <CopyButton text={txn.to_address} />
              <Chip
                variant="bordered"
                className="rounded-lg shadow-xl shadow-background/50 dark:border-gray-700/75"
              >
                {price === undefined ? (
                  <span className="text-success-700">
                    <FMono>{microToPyusd(txn.quantity).toFixed(2)} </FMono>
                    <span className="text-sm">PYUSD</span>
                  </span>
                ) : (
                  <FMono className="text-success-700">
                    ${(microToPyusd(txn.quantity) * price).toFixed(2)} USD
                  </FMono>
                )}
              </Chip>
            </li>
          ))}
        </ul>
      </CardBody>
      <Divider />
      <CardFooter>
        <LinkButton href="/pyusd-transfers" variant="light" className="group">
          <span className="font-serif uppercase dark:text-gray-400 dark:group-hover:text-secondary">
            View All PYUSD Transfers
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
