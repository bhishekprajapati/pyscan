"use client";

import { microToPyusd } from "@/lib/converters";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import BoringAvatar from "boring-avatars";
import { ArrowRight, Eye } from "lucide-react";
import CopyButton from "../copy-button";
import { AddressLink } from "../links";
import { FMono, TextTruncate } from "../text";
import Timestamp from "../timestamp";

const columns = [
  { name: "From", uid: "from" },
  { name: "", uid: "arrow" },
  { name: "To", uid: "to" },
  { name: "Time", uid: "timestamp" },
  { name: "Amount", uid: "Amount" },
  { name: "", uid: "eye" },
];

type Props = {
  data: {
    block_number: number;
    block_timestamp: string;
    transaction_hash: string;
    event_hash: string;
    from_address: string;
    to_address: string;
    quantity: string;
    event_index: number;
  }[];
  price: number | undefined;
};

const LatestPyusdTransfersTable: React.FC<Props> = ({ data, price }) => (
  <Table
    aria-label="latest pyusd token transfers"
    className="overflow-x-auto bg-default"
    classNames={{
      th: "bg-transparent border-b border-b-divider text-sm",
      tbody: "[&>tr:nth-child(2n+1)]:bg-background/40",
      thead: "py-8",
    }}
    removeWrapper
  >
    <TableHeader columns={columns}>
      {(col) => <TableColumn key={col.uid}>{col.name}</TableColumn>}
    </TableHeader>
    <TableBody>
      {data.map((txn) => (
        <TableRow key={txn.transaction_hash + txn.event_index}>
          <TableCell>
            <div className="flex items-center gap-2">
              <BoringAvatar name={txn.from_address} size={24} />
              <AddressLink address={txn.from_address}>
                <TextTruncate>
                  <FMono>{txn.from_address}</FMono>
                </TextTruncate>
              </AddressLink>
              <CopyButton text={txn.from_address} />
            </div>
          </TableCell>
          <TableCell>
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-blue-700/15 bg-blue-700/10">
              <ArrowRight size={12} className="text-blue-700" />
            </span>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <AddressLink address={txn.to_address}>
                <TextTruncate>
                  <FMono>{txn.to_address}</FMono>
                </TextTruncate>
              </AddressLink>
              <CopyButton text={txn.from_address} />
            </div>
          </TableCell>
          <TableCell>
            <div className="text-sm">
              <Timestamp
                stamp={txn.block_timestamp}
                icon={false}
                string={false}
              />
            </div>
          </TableCell>
          <TableCell>
            <Chip
              variant="bordered"
              className="rounded-lg shadow-xl shadow-background/50 dark:border-gray-700/75"
            >
              {price === undefined ? (
                <span className="text-success-700">
                  <FMono>{microToPyusd(txn.quantity).toFixed(2)} </FMono>
                  <span className="text-sm">PYUSD</span>
                </span>
              ) : (
                <FMono className="text-success-700">
                  ${(microToPyusd(txn.quantity) * price).toFixed(2)} USD
                </FMono>
              )}
            </Chip>
          </TableCell>
          <TableCell>
            <Chip variant="bordered" className="rounded-md border-divider">
              <Eye size={16} />
            </Chip>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default LatestPyusdTransfersTable;
