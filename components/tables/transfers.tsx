"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import TimeAgo from "react-timeago";
import { ErrorBoundary } from "react-error-boundary";

import { FMono, TextClipboardCopy, TextTruncate } from "../text";
import { useTransfers } from "@/hooks/table";

const columns = [
  { name: "Transaction Hash", uid: "transaction_hash" },
  { name: "Block", uid: "block_number" },
  { name: "Age", uid: "age" },
  { name: "From", uid: "from_address" },
  { name: "To", uid: "to_address" },
  { name: "Amount", uid: "quantity" },
];

const _Table = () => {
  const query = useTransfers();
  const data = query.data ?? [];

  return (
    <Table
      aria-label="pyusd transfers table"
      className="overflow-x-auto bg-default"
      classNames={{
        th: "bg-transparent border-b border-b-divider text-sm",
        tbody: "[&>tr:nth-child(2n+1)]:bg-background/40",
        thead: "py-8",
      }}
      removeWrapper
    >
      <TableHeader columns={columns}>
        {(col) => (
          <TableColumn key={col.uid} className="font-serif">
            {col.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody>
        {data.map((transfer) => (
          <TableRow key={transfer.transaction_hash + transfer.event_index}>
            <TableCell>
              <TextTruncate className="max-w-32">
                <FMono>{transfer.transaction_hash}</FMono>
                <TextClipboardCopy content={transfer.transaction_hash} />
              </TextTruncate>
            </TableCell>
            <TableCell>{transfer.block_number.toString()}</TableCell>
            <TableCell>
              <TimeAgo date={transfer.block_timestamp.value} />
            </TableCell>
            <TableCell>
              <FMono>{transfer.from_address}</FMono>
            </TableCell>
            <TableCell>
              <FMono>{transfer.to_address}</FMono>
            </TableCell>
            <TableCell>{transfer.quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const TransfersTable = () => (
  <ErrorBoundary fallback={<>error occured</>}>
    <_Table />
  </ErrorBoundary>
);

export default TransfersTable;
