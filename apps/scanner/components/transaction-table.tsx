"use client";

import type { FC } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";

import { useTransactions, UseTransactionsOptions } from "@/hooks/data";
import { clip } from "@/utils/eth";
import { TextClipboardCopy, TextTruncate } from "./text";

type TransactionTableProps = UseTransactionsOptions;

const TransactionTable: FC<TransactionTableProps> = ({
  initialData,
  endpoint,
}) => {
  const data = useTransactions({
    initialData,
    endpoint,
  });

  return (
    <Table aria-label="transactions">
      <TableHeader>
        <TableColumn>Transaction Hash</TableColumn>
        <TableColumn>Block</TableColumn>
        <TableColumn>From</TableColumn>
        <TableColumn>to</TableColumn>
      </TableHeader>
      <TableBody>
        {data.map(({ transactionHash, logIndex, blockNumber, topics }) => (
          <TableRow key={transactionHash + logIndex}>
            <TableCell>
              <TextTruncate className="max-w-32">
                {transactionHash}
                <TextClipboardCopy content={transactionHash} />
              </TextTruncate>
            </TableCell>
            <TableCell>{blockNumber.toString()}</TableCell>
            <TableCell>{clip(topics[1], 10)}</TableCell>
            <TableCell>{clip(topics[2], 10)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
