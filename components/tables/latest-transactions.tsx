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
      as="div"
      aria-label="latest transactions"
      className={tableClassName}
      classNames={tableClassNames}
      removeWrapper
    >
      <TableHeader as="div" columns={columns}>
        {(col) => (
          <TableColumn as="div" className="hidden" key={col.uid}>
            <></>
          </TableColumn>
        )}
      </TableHeader>
      <TableBody as="div">
        {txns.map((txn) => (
          <TableRow as="div" key={txn.hash + txn.transactionIndex + txn.nonce}>
            <TableCell as="div">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-default !text-gray-300">
                <ReceiptText size={20} strokeWidth={1.5} />
              </div>
            </TableCell>
            <TableCell as="div">
              <div className="flex items-center gap-2">
                <TransactionLink hash={txn.hash}>
                  <TextTruncate className="w-64">
                    <FMono>{txn.hash}</FMono>
                  </TextTruncate>
                </TransactionLink>
                <CopyButton text={txn.hash} />
              </div>
            </TableCell>
            <TableCell as="div">
              <div className="me-16 min-w-max text-sm">
                <Timestamp stamp={blockTimestamp} icon={false} string={false} />
              </div>
            </TableCell>
            <TableCell as="div">
              <div>
                <AddressLink address={txn.from}>
                  <FMono>{txn.from}</FMono>
                </AddressLink>
              </div>
            </TableCell>
            <TableCell as="div">
              <div className="flex gap-4">
                <span className="mx-2 flex h-6 w-6 items-center justify-center rounded-full border border-secondary/15 bg-secondary/10">
                  <ArrowRight size={12} className="text-secondary" />
                </span>
                {txn.to && (
                  <AddressLink address={txn.to}>
                    <FMono>{txn.to}</FMono>
                  </AddressLink>
                )}
              </div>
            </TableCell>
            <TableCell as="div">
              <div>
                <Chip
                  variant="bordered"
                  className="ms-auto rounded-lg shadow-xl shadow-background/50 dark:border-gray-700/75"
                >
                  <FMono>
                    <WeiToEther wei={txn.value} />
                  </FMono>
                </Chip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LatestTransactionTable;
