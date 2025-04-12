"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Box } from "lucide-react";
import type { Address, GetEnsNameReturnType } from "viem";
import { AddressLink, BlockLink, BlockTransactionsLink } from "../links";
import { FMono, TextTruncate } from "../text";
import Timestamp from "../timestamp";
import { col, tableClassNames } from "../ui/table";

const columns = [
  col("", "icon"),
  col("number", "Block Number"),
  col("info", "Info"),
];

type Props = {
  blocks: {
    number: bigint;
    timestamp: bigint;
    miner: Address;
    ensName: GetEnsNameReturnType;
    duration: bigint;
    transactionCount: number;
  }[];
};

const LatestBlockTable: React.FC<Props> = ({ blocks }) => {
  return (
    <Table
      aria-label="latest blocks"
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
        {blocks.map((block) => (
          <TableRow className="" key={block.number.toString()}>
            <TableCell>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background !text-gray-300">
                <Box size={24} strokeWidth={1.5} />
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div>
                  <BlockLink number={block.number}>
                    <FMono>{block.number}</FMono>
                  </BlockLink>
                </div>
                <div className="text-sm">
                  <Timestamp
                    stamp={block.timestamp}
                    icon={false}
                    string={false}
                  />
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="flex items-center gap-1">
                  Miner
                  <TextTruncate className="w-16 sm:w-24 md:w-40 lg:w-full">
                    <AddressLink address={block.miner}>
                      {block.ensName ? block.ensName : block.miner}
                    </AddressLink>
                  </TextTruncate>
                </div>
                <BlockTransactionsLink number={block.number}>
                  {block.transactionCount}
                </BlockTransactionsLink>{" "}
                txns {block.duration.toString()} in secs
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LatestBlockTable;
