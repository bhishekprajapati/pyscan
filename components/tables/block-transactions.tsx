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
import { FMono, TextTruncate } from "../text";
import CopyButton from "../copy-button";
import { AddressLink, TransactionLink } from "../links";

type TRowData = {
  hash: string;
  // method: string;
  blockNumber: bigint;
  age: bigint;
  from: string;
  to: string | null;
  amount: bigint;
  // fee: bigint;
};

const columns = [
  { name: "Transaction Hash", uid: "hash" },
  // { name: "Method", uid: "method" },
  { name: "Block", uid: "blockNumber" },
  { name: "Age", uid: "age" },
  { name: "From", uid: "from" },
  { name: "To", uid: "to" },
  { name: "Amount", uid: "amount" },
  // { name: "Txn Fee", uid: "fee" },
];

const BlockTransactionsTable = ({ data }: { data: TRowData[] }) => (
  <div className="m-4 overflow-hidden rounded-xl">
    <Table
      aria-label="eth blocks table"
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
        {data.map((tx) => (
          <TableRow key={tx.hash}>
            <TableCell>
              <TransactionLink hash={tx.hash}>
                <FMono>
                  <TextTruncate className="w-56">{tx.hash}</TextTruncate>
                </FMono>
              </TransactionLink>
              <CopyButton value={tx.hash} />
            </TableCell>
            {/* <TableCell>{tx.method}</TableCell> */}
            <TableCell>{tx.blockNumber}</TableCell>
            <TableCell>
              <TimeAgo date={new Date(Number(tx.age) * 1000)} />
            </TableCell>
            <TableCell>
              <AddressLink address={tx.from}>
                <FMono>
                  <TextTruncate className="w-48">{tx.from}</TextTruncate>
                </FMono>
              </AddressLink>
              <CopyButton value={tx.from} />
            </TableCell>
            <TableCell>
              {tx.to && (
                <>
                  <AddressLink address={tx.to}>
                    <FMono>
                      <TextTruncate className="w-48">{tx.to}</TextTruncate>
                    </FMono>
                    <CopyButton value={tx.to} />
                  </AddressLink>
                </>
              )}
            </TableCell>
            <TableCell>{tx.amount}</TableCell>
            {/* <TableCell>{tx.fee}</TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default BlockTransactionsTable;
