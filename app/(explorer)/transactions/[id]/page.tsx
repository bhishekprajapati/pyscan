export const dynamic = "force-dynamic";

import { BlockLink } from "@/components/links";
import Timestamp from "@/components/timestamp";
import LinkButton from "@/components/ui/link-button";
import ObjectKeys from "@/components/ui/object-keys";
import ethereum from "@/lib/ethereum";
import { Chip, Code, Tooltip } from "@heroui/react";
import Link from "next/link";
import { Hash } from "viem";

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
    <section>
      <header></header>
      <ul className="m-4 flex flex-col gap-4">
        <li>
          <ObjectKeys
            data={data}
            entries={[
              {
                label: "Transaction Hash",
                helpText:
                  "A TxHash or transaction hash is a unique 66-character identifier that is generated whenever a transaction is executed.",
                renderValue: ({ hash }) => hash,
              },
              // {
              //   label: "status",
              //   helpText: "The finality status of the block. ",
              //   renderValue: ({ isFinalized }) =>
              //     isFinalized ? (
              //       <Chip
              //         variant="flat"
              //         color="success"
              //         startContent={<Check size={16} />}
              //       >
              //         Finalized
              //       </Chip>
              //     ) : (
              //       <Chip
              //         variant="flat"
              //         color="warning"
              //         startContent={
              //           <LoaderCircle
              //             size={16}
              //             className="animate-spinner-ease-spin"
              //           />
              //         }
              //       >
              //         Unfinalized
              //       </Chip>
              //     ),
              // },
              {
                label: "Block",
                helpText:
                  "Number of the block in which the transaction is recorded. Block confirmations indicate how many blocks have been added since the transaction was produced.",
                renderValue: ({ blockNumber, blockConfirmation }) => (
                  <span>
                    <BlockLink number={blockNumber} className="me-2">
                      {blockNumber.toString()}
                    </BlockLink>
                    <Tooltip content="Number of blocks produced since">
                      <Chip variant="faded">
                        {blockConfirmation} Block Confirmations
                      </Chip>
                    </Tooltip>
                  </span>
                ),
              },
              {
                label: "Timestamp",
                helpText:
                  "The date and time at which a transaction is produced.",
                renderValue: ({ timestamp }) => <Timestamp stamp={timestamp} />,
              },
            ]}
          />
        </li>
        <li>
          <ObjectKeys
            data={data}
            entries={[
              {
                label: "From",
                helpText: "The sending party of the transaction.",
                renderValue: ({ from }) => from,
              },
              {
                label: "To",
                helpText:
                  "The receiving party of the transaction (could be a contract address).",
                renderValue: ({ to }) => to,
              },
              {
                label: "Value",
                helpText:
                  "The value being transacted in Ether and fiat value. Note: You can click the fiat value (if available) to see historical value at the time of transaction.",
                renderValue: ({ value }) => value.toString(),
              },
              // {
              //   label: "Value",
              //   helpText:
              //     "The number of transactions in the block. Internal transaction is transactions as a result of contract execution that involves Ether value.",
              //   renderValue: ({  }) => value.toString(),
              // },
              {
                label: "Gas Price",
                helpText:
                  "Cost per unit of gas spent for the transaction, in Ether and Gwei.",
                renderValue: ({ gasPrice }) => gasPrice?.toString() ?? 0,
              },
            ]}
          />
        </li>
      </ul>
    </section>
  );
};

export default TransactionPage;
