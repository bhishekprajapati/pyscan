import Timestamp from "@/components/timestamp";
import LinkButton from "@/components/ui/link-button";
import ObjectKeys from "@/components/ui/object-keys";
import ethereum from "@/lib/ethereum";
import { Button, ButtonGroup, Chip, Code, Tooltip } from "@heroui/react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  LoaderCircle,
} from "lucide-react";
import { z } from "zod";

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
  const block = await ethereum.mainnet.getBlockInfo(blockNumber);
  const burntFees = Number(block.baseFeePerGas ?? 0) * Number(block.gasUsed);

  const data = {
    ...block,
    burntFees,
  };

  // TODO: enable or disable next and prev button based on the block number

  return (
    <section className="p-4">
      <header className="mb-4 text-2xl">
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
                        // @ts-expect-error
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
                        // @ts-expect-error
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
                renderValue: ({ isFinalized }) =>
                  isFinalized ? (
                    <Chip
                      variant="flat"
                      color="success"
                      startContent={<Check size={16} />}
                    >
                      Finalized
                    </Chip>
                  ) : (
                    <Chip
                      variant="flat"
                      color="warning"
                      startContent={
                        <LoaderCircle
                          size={16}
                          className="animate-spinner-ease-spin"
                        />
                      }
                    >
                      Unfinalized
                    </Chip>
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
                renderValue: ({ transactions }) => (
                  <span>{transactions.length} transactions in this block</span>
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
                renderValue: ({ miner }) => miner,
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
                renderValue: ({ gasUsed }) => gasUsed,
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
                renderValue: ({ gasLimit }) => gasLimit,
              },
              {
                label: "Base Fee Per Gas",
                helpText: "Base fee per gas",
                renderValue: ({ baseFeePerGas }) => baseFeePerGas,
              },
              {
                label: "Burnt Fees",
                helpText:
                  "Post-London Upgrade, this represents the part of the tx fee that is burnt: baseFeePerGas * gasUsed.",
                renderValue: ({ burntFees }) => `🔥 ${burntFees}`,
              },
              {
                label: "Extra Data",
                helpText: "'Extra data' field of this block",
                renderValue: ({ extraData }) => extraData,
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
                renderValue: ({ hash }) => hash,
              },
              {
                label: "Parent Hash",
                helpText:
                  "The hash of the block from which this block was generated, also known as its parent block.",
                renderValue: ({ parentHash }) => parentHash,
              },
              {
                label: "State Root",
                helpText: "The root of the state trie",
                renderValue: ({ stateRoot }) => stateRoot,
              },
              {
                label: "Withdrawals Root",
                helpText: "Block header withdrawal root hash",
                renderValue: ({ withdrawalsRoot }) => withdrawalsRoot,
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
