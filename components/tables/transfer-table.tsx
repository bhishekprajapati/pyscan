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

import { TextClipboardCopy, TextTruncate } from "../text";
import type { TransfersApiResponse } from "@/pages/api/mainnet/transfers";
import { isServer, useQuery } from "@tanstack/react-query";

const useTransfers = () =>
  useQuery({
    queryKey: ["mainnet", "transfers"],
    queryFn: async ({ signal }) => {
      const res = await fetch("/api/mainnet/transfers", {
        signal,
      });
      const json = (await res.json()) as TransfersApiResponse;
      if (!json.ok) {
        throw Error(json.error.message);
      }
      return json.data;
    },
    enabled: !isServer,
  });

const columns = [
  { name: "Transaction Hash", uid: "transaction_hash" },
  { name: "Block", uid: "block_number" },
  { name: "Age", uid: "age" },
  { name: "From", uid: "from_address" },
  { name: "To", uid: "to_address" },
  { name: "Amount", uid: "quantity" },
];

export const TransfersTable = () => {
  const query = useTransfers();
  const data = query.data ?? [];

  return (
    <Table
      aria-label="pyusd transfers table"
      classNames={{
        th: "bg-transparent border-b border-b-divider text-sm",
        tbody: "[&>tr:nth-child(2n+1)]:bg-default/40",
        thead: "py-8",
      }}
      removeWrapper
    >
      <TableHeader columns={columns}>
        {(col) => <TableColumn key={col.uid}>{col.name}</TableColumn>}
      </TableHeader>
      <TableBody>
        {data.map((transfer) => (
          <TableRow key={transfer.transaction_hash + transfer.event_index}>
            <TableCell>
              <TextTruncate className="max-w-32">
                {transfer.transaction_hash}
                <TextClipboardCopy content={transfer.transaction_hash} />
              </TextTruncate>
            </TableCell>
            <TableCell>{transfer.block_number.toString()}</TableCell>
            <TableCell>
              <TimeAgo date={transfer.block_timestamp.value} />
            </TableCell>
            <TableCell>{transfer.from_address}</TableCell>
            <TableCell>{transfer.to_address}</TableCell>
            <TableCell>{transfer.quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
