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

import { FMono } from "../text";
import { useBlocks } from "@/hooks/tables/blocks";
import { AddressLink, BlockLink, BlockTransactionsLink } from "../links";
import CopyButton from "../copy-button";

const columns = [
  { name: "Block", uid: "block_number" },
  { name: "Age", uid: "block_timestamp" },
  { name: "Txn", uid: "transaction_count" },
  { name: "Fee Recipient", uid: "miner" },
  { name: "Gas Used", uid: "gas_used" },
  { name: "Gas Limit", uid: "gas_limit" },
];

const BTable = () => {
  const query = useBlocks();
  const data = query.data ?? [];

  return (
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
          {data.map((bk) => (
            <TableRow key={bk.block_number}>
              <TableCell>
                <BlockLink number={BigInt(bk.block_number)}>
                  <FMono>{bk.block_number}</FMono>
                </BlockLink>
              </TableCell>
              <TableCell>
                <TimeAgo date={bk.block_timestamp.value} />
              </TableCell>
              <TableCell>
                <BlockTransactionsLink number={BigInt(bk.block_number)}>
                  <FMono>{bk.transaction_count}</FMono>
                </BlockTransactionsLink>
              </TableCell>
              <TableCell>
                <AddressLink address={bk.miner}>
                  <FMono>{bk.miner}</FMono>
                </AddressLink>
                <CopyButton value={bk.miner} />
              </TableCell>
              <TableCell>
                <FMono>{bk.gas_used}</FMono>
              </TableCell>
              <TableCell>{bk.gas_limit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const BlocksTable = () => (
  <ErrorBoundary fallback={<>error occured</>}>
    <BTable />
  </ErrorBoundary>
);

export default BlocksTable;
