export const dynamic = "force-dynamic";

import { WeiToEther, WeiToGwei } from "@/components/eth";
import { AddressLink, BlockTransactionsLink } from "@/components/links";
import { FMono } from "@/components/text";
import Timestamp from "@/components/timestamp";
import LinkButton from "@/components/ui/link-button";
import ObjectKeys from "@/components/ui/object-keys";
import ethereum from "@/lib/ethereum";
import { Chip, Code, Skeleton, Tooltip } from "@heroui/react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  LoaderCircle,
} from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";
import { BlockNumber } from "viem";
import { z } from "zod";

export const metadata: Metadata = {
  title: "Pyscan | Block",
};

const BlockFinalityStatus = async ({ number }: { number: BlockNumber }) => {
  const result = await ethereum.mainnet.getIsBlockFinalized(number);
  if (!result.success)
    return <span className="text-danger">Failed to fetch status...</span>;

  const isFinalized = result.data;
  return isFinalized ? (
    <Chip variant="flat" color="success" startContent={<Check size={16} />}>
      Finalized
    </Chip>
  ) : (
    <Chip
      variant="flat"
      color="warning"
      startContent={
        <LoaderCircle size={16} className="animate-spinner-ease-spin" />
      }
    >
      Unfinalized
    </Chip>
  );
};

type FC = React.FC<PageProps<{ id: string }>>;

const schema = z.coerce.bigint().positive();

const BlockPage: FC = async ({ params }) => {
  const { id } = await params;
  const validation = schema.safeParse(id);

  if (!validation.success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-32">
        <Code>{id}</Code>
        <p className="text-xl font-bold">Invalid Block Number</p>
        <LinkButton href="/" size="md">
          Back To Explorer
        </LinkButton>
      </div>
    );
  }

  const blockNumber = validation.data;
  const result = await ethereum.mainnet.getBlockInfo(blockNumber);
  if (!result.success) return <>error occured...</>;
  const { data: block } = result;
  const burntFees = Number(block.baseFeePerGas ?? 0) * Number(block.gasUsed);

  const data = {
    ...block,
    burntFees,
  };

  // TODO: enable or disable next and prev button based on the block number
  // TODO: fix ui on mobile

  return (
    <section className="p-4">
      <header className="mb-4 font-serif text-2xl">
        <span className="me-2 font-bold">Block </span>
        <span className="text-lg text-gray-400">#{blockNumber.toString()}</span>
      </header>
      <ul className="flex flex-col gap-4">
        <li>
          <ObjectKeys
            data={data}
            entries={[
              {
                label: "Block Height",
                helpText:
                  "Also known as Block Number. The block height, which indicates the length of the blockchain, increases after the addition of the new block.",
                renderValue: ({ number }) => (
                  <div className="flex items-center gap-2">
                    <span>{number}</span>
                    <Tooltip content="View previous block">
                      <LinkButton
                        // @ts-expect-error dynamic route
                        href={`/blocks/${(number - BigInt(1)).toString()}`}
                        size="sm"
                        variant="faded"
                        isIconOnly
                      >
                        <ChevronLeft size={16} />
                      </LinkButton>
                    </Tooltip>
                    <Tooltip content="View next block">
                      <LinkButton
                        // @ts-expect-error dynamic route
                        href={`/blocks/${(number + BigInt(1)).toString()}`}
                        size="sm"
                        variant="faded"
                        isIconOnly
                      >
                        <ChevronRight size={16} />
                      </LinkButton>
                    </Tooltip>
                  </div>
                ),
              },
              {
                label: "status",
                helpText: "The finality status of the block. ",
                renderValue: ({ number }) => (
                  <Suspense
                    fallback={
                      <Skeleton className="h-7 w-[5.75rem] rounded-full" />
                    }
                  >
                    <BlockFinalityStatus number={number} />
                  </Suspense>
                ),
              },
              {
                label: "Timestamp",
                helpText: "The date and time at which a block is produced.",
                renderValue: ({ timestamp }) => (
                  <Timestamp stamp={timestamp} ago />
                ),
              },
              {
                label: "Transactions",
                helpText:
                  "The number of transactions in the block. Internal transaction is transactions as a result of contract execution that involves Ether value.",
                renderValue: ({ transactions, number }) => (
                  <span>
                    <BlockTransactionsLink number={number} dataId={false}>
                      {transactions.length}
                    </BlockTransactionsLink>{" "}
                    transactions in this block
                  </span>
                ),
              },
              {
                label: "Withdrawals",
                helpText: "Number of beacon withdrawals in this block",
                shouldRender: ({ withdrawals }) => !!withdrawals,
                renderValue: ({ withdrawals = [] }) => (
                  <span>{withdrawals.length} in this block</span>
                ),
              },
            ]}
          />
        </li>
        <li>
          <ObjectKeys
            data={data}
            entries={[
              {
                label: "Fee Recipient",
                helpText:
                  "Address receiving fees from transactions in this block",
                renderValue: ({ miner }) => (
                  <FMono>
                    <AddressLink address={miner} dataId={false}>
                      {miner}
                    </AddressLink>
                  </FMono>
                ),
              },
              {
                label: "Total Difficulty",
                helpText: "Total difficulty of the chain until this block",
                renderValue: ({ totalDifficulty }) => (
                  <span>{totalDifficulty?.toString() ?? 0}</span>
                ),
              },
              {
                label: "Size",
                helpText:
                  "The block size is actually determined by the block's gas limit.",
                renderValue: ({ size }) => <span>{size.toString()} bytes</span>,
              },
            ]}
          />
        </li>
        <li>
          <ObjectKeys
            data={data}
            entries={[
              {
                label: "Gas Used",
                helpText: "Total used gas by all transactions in this block",
                renderValue: ({ gasUsed }) => `${gasUsed} Gas Units`,
              },
              {
                label: "Blob Gas Used",
                helpText:
                  "Total used blob gas by all transactions in this block",
                renderValue: ({ blobGasUsed }) => blobGasUsed,
              },
              {
                label: "Gas Limit",
                helpText: "Maximum gas allowed in this block",
                renderValue: ({ gasLimit }) => `${gasLimit} Gas Units`,
              },
              {
                label: "Base Fee Per Gas",
                helpText: "Base fee per gas",
                renderValue: ({ baseFeePerGas }) => (
                  <WeiToGwei
                    wei={baseFeePerGas === null ? undefined : baseFeePerGas}
                  />
                ),
              },
              {
                label: "Burnt Fees",
                helpText:
                  "Post-London Upgrade, this represents the part of the tx fee that is burnt: baseFeePerGas * gasUsed.",
                renderValue: ({ burntFees }) => (
                  <>
                    🔥 <WeiToEther wei={BigInt(burntFees)} />
                  </>
                ),
              },
              {
                label: "Extra Data",
                helpText: "'Extra data' field of this block",
                renderValue: ({ extraData }) => <FMono>{extraData}</FMono>,
              },
            ]}
          />
        </li>
        <li>
          <ObjectKeys
            data={data}
            entries={[
              {
                label: "Hash",
                helpText: "The hash of the block header of the current block.",
                renderValue: ({ hash }) => <FMono>{hash}</FMono>,
              },
              {
                label: "Parent Hash",
                helpText:
                  "The hash of the block from which this block was generated, also known as its parent block.",
                renderValue: ({ parentHash }) => <FMono>{parentHash}</FMono>,
              },
              {
                label: "State Root",
                helpText: "The root of the state trie",
                renderValue: ({ stateRoot }) => <FMono>{stateRoot}</FMono>,
              },
              {
                label: "Withdrawals Root",
                helpText: "Block header withdrawal root hash",
                shouldRender: ({ withdrawalsRoot }) => !!withdrawalsRoot,
                renderValue: ({ withdrawalsRoot }) =>
                  withdrawalsRoot && <FMono>{withdrawalsRoot}</FMono>,
              },
              {
                label: "Nonce",
                helpText:
                  "Block nonce is a value used during mining to demonstrate proof of work for a block. The field is no longer used under the Proof-of-Stake network.",
                renderValue: ({ nonce }) => nonce,
              },
            ]}
          />
        </li>
        <li className="dark:text-gray-400">
          <p className="my-2">
            <Info size={16} className="me-2 inline-block align-text-bottom" />
            Blocks are batches of transactions linked via cryptographic hashes.
            Any tampering of a block would invalidate all following blocks as
            all subsequent hashes would change.
          </p>
        </li>
      </ul>
    </section>
  );
};

export default BlockPage;
