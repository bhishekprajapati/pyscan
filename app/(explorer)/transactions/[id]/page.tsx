export const dynamic = "force-dynamic";

import { BlockLink } from "@/components/links";
import { Tabs } from "@/components/tabs";
import Timestamp from "@/components/timestamp";
import LinkButton from "@/components/ui/link-button";
import ObjectKeys from "@/components/ui/object-keys";
import { LogsJsonView } from "@/components/json-view";
import ethereum from "@/lib/ethereum";

import { Chip, Code, Textarea, Tooltip } from "@heroui/react";
import { Check, X } from "lucide-react";
import { Hash } from "viem";
import { FMono } from "@/components/text";

type Transaction = Extract<
  Awaited<ReturnType<typeof ethereum.mainnet.getTransaction>>,
  { success: true }
>["data"];

const Overview = ({ tx }: { tx: Transaction }) => {
  return (
    <ul className="flex flex-col gap-4">
      <li>
        <ObjectKeys
          data={tx}
          entries={[
            {
              label: "Type",
              helpText: "Type of the transaction",
              renderValue: ({ type }) => type,
            },
            {
              label: "Transaction Hash",
              helpText:
                "A TxHash or transaction hash is a unique 66-character identifier that is generated whenever a transaction is executed.",
              renderValue: ({ hash }) => <FMono>{hash}</FMono>,
            },
            {
              label: "status",
              helpText: "The status of the transaction",
              renderValue: ({ status }) =>
                status === "success" ? (
                  <Chip
                    variant="flat"
                    color="success"
                    startContent={<Check size={16} />}
                  >
                    Success
                  </Chip>
                ) : (
                  <Chip
                    variant="flat"
                    color="danger"
                    startContent={<X size={16} />}
                  >
                    Reverted
                  </Chip>
                ),
            },
            {
              label: "Block",
              helpText:
                "Number of the block in which the transaction is recorded. Block confirmations indicate how many blocks have been added since the transaction was produced.",
              renderValue: ({ blockNumber, confirmation }) => (
                <span>
                  <BlockLink number={blockNumber} className="me-2">
                    {blockNumber.toString()}
                  </BlockLink>
                  <Tooltip content="Number of blocks produced since">
                    <Chip variant="faded">
                      {confirmation} Block Confirmations
                    </Chip>
                  </Tooltip>
                </span>
              ),
            },
            {
              label: "Timestamp",
              helpText: "The date and time at which a transaction is produced.",
              renderValue: ({ timestamp }) => <Timestamp stamp={timestamp} />,
            },
            {
              label: "Nonce",
              helpText: "Unique number identifying this transaction",
              renderValue: ({ nonce }) => nonce,
            },
          ]}
        />
      </li>
      <li>
        <ObjectKeys
          data={tx}
          entries={[
            {
              label: "From",
              helpText: "The sending party of the transaction.",
              renderValue: ({ from }) => <FMono>{from}</FMono>,
            },
            {
              label: "To",
              helpText:
                "The receiving party of the transaction (could be a contract address).",
              renderValue: ({ to }) => <FMono>{to}</FMono>,
            },
            {
              label: "Value",
              helpText:
                "The value being transacted in Ether and fiat value. Note: You can click the fiat value (if available) to see historical value at the time of transaction.",
              renderValue: ({ value }) => value.toString(),
            },
            {
              label: "Gas Price",
              helpText:
                "Cost per unit of gas spent for the transaction, in Ether and Gwei.",
              renderValue: ({ gasPrice }) => gasPrice?.toString() ?? 0,
            },
          ]}
        />
      </li>
      <li>
        <ObjectKeys
          data={tx}
          entries={[
            {
              label: "Input Data",
              helpText:
                "Additional data included for this transaction. Commonly used as part of contract interaction or as a message sent to the recipient.",
              renderValue: ({ input }) => (
                <FMono>
                  <Textarea
                    variant="bordered"
                    color="default"
                    value={input}
                    isDisabled
                  />
                </FMono>
              ),
            },
          ]}
        />
      </li>
    </ul>
  );
};

const Logs = ({ tx }: { tx: Transaction }) => (
  <ul className="flex flex-col gap-4">
    <li>
      <ObjectKeys
        data={tx}
        entries={[
          {
            label: "Logs",
            helpText: "",
            renderValue: ({ logs }) => <LogsJsonView value={logs} />,
          },
          {
            label: "Logs Bloom",
            helpText: "",
            renderValue: ({ logsBloom }) => (
              <FMono>
                <Textarea variant="bordered" value={logsBloom} isDisabled />
              </FMono>
            ),
          },
        ]}
      />
    </li>
  </ul>
);

type FC = React.FC<PageProps<{ id: string }>>;

const TransactionPage: FC = async ({ params }) => {
  const { id } = await params;
  const result = await ethereum.mainnet.getTransaction(id as Hash);

  if (!result.success) {
    const { err } = result;
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-32">
        <Code>{id}</Code>
        <p className="text-xl font-bold">
          {err.isInternal ? "Something went wrong" : err.message}
        </p>
        <LinkButton href="/" size="md">
          Back To Explorer
        </LinkButton>
      </div>
    );
  }

  const { data } = result;

  return (
    <div className="m-4">
      <Tabs
        list={[
          {
            key: "overview",
            title: "Overview",
            tab: <Overview tx={data} />,
          },
          {
            key: "logs",
            title: "Logs",
            tab: <Logs tx={data} />,
          },
        ]}
      />
    </div>
  );
};

export default TransactionPage;
