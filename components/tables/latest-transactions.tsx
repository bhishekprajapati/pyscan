"use client";

import ethereum from "@/lib/ethereum";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { ArrowRight, ReceiptText } from "lucide-react";
import CopyButton from "../copy-button";
import { WeiToEther } from "../eth";
import { AddressLink, TransactionLink } from "../links";
import { FMono, TextTruncate } from "../text";
import Timestamp from "../timestamp";
import { col, tableClassName, tableClassNames } from "../ui/table";

const columns = [
  col("", "icon"),
  col("hash", "Hash"),
  col("from", "From"),
  col("timestamp", "Timestamp"),
  col("to", "To"),
  col("amount", "Amount"),
];

type Props = {
  txns: Extract<
    Awaited<ReturnType<typeof ethereum.mainnet.getLatestTransactions>>,
    { success: true }
  >["data"]["txns"];
  blockTimestamp: bigint;
};

const LatestTransactionTable: React.FC<Props> = ({ txns, blockTimestamp }) => {
  return (
    <Table
      aria-label={`latest blocks`}
      className={tableClassName}
      classNames={tableClassNames}
      removeWrapper
    >
      <TableHeader columns={columns}>
        {(col) => (
          <TableColumn className="hidden" key={col.uid}>
            <></>
          </TableColumn>
        )}
      </TableHeader>
      <TableBody>
        {txns.map((txn) => (
          <TableRow
            className="group"
            key={txn.hash + txn.transactionIndex + txn.nonce}
          >
            <TableCell>
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background !text-gray-300">
                  <ReceiptText
                    size={20}
                    strokeWidth={1.5}
                    className="group-hover:text-primary"
                  />
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <TransactionLink hash={txn.hash}>
                  <TextTruncate className="w-64">
                    <FMono>{txn.hash}</FMono>
                  </TextTruncate>
                </TransactionLink>
                <CopyButton
                  className="pointer-events-none opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100"
                  text={txn.hash}
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="me-16 text-sm">
                <Timestamp stamp={blockTimestamp} icon={false} string={false} />
              </div>
            </TableCell>
            <TableCell>
              <AddressLink address={txn.from}>
                <FMono>{txn.from}</FMono>
              </AddressLink>
            </TableCell>
            <TableCell>
              <span className="mx-2 flex h-6 w-6 items-center justify-center rounded-full border border-secondary/15 bg-secondary/10">
                <ArrowRight size={12} className="text-secondary" />
              </span>
              {txn.to && (
                <AddressLink address={txn.to}>
                  <FMono>{txn.to}</FMono>
                </AddressLink>
              )}
            </TableCell>
            <TableCell>
              <Chip
                variant="bordered"
                className="ms-auto rounded-lg shadow-xl shadow-background/50 dark:border-gray-700/75"
              >
                <FMono>
                  <WeiToEther wei={txn.value} />
                </FMono>
              </Chip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LatestTransactionTable;
