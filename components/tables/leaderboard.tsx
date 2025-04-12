"use client";

import CopyButton from "@/components/copy-button";
import { AddressLink } from "@/components/links";
import { FMono, TextTruncate } from "@/components/text";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeading,
  CardTimestamp,
} from "@/components/ui/card";
import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import BoringAvatar from "boring-avatars";

const columns = [
  { name: "", uid: "avatar" },
  { name: "Wallet Address", uid: "address" },
  { name: "Value", uid: "Value" },
];

export type LeaderboardTableProps = {
  data: {
    address: string;
    value: string;
  }[];
  timestamp?: string | undefined;
  heading: string;
  freshness?: string;
};

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  data,
  timestamp,
  heading,
  freshness,
}) => (
  <Card>
    <CardHeader>
      <CardHeading>{heading}</CardHeading>
      {freshness && <span className="text-default-400">{freshness}</span>}
      {timestamp && <CardTimestamp date={new Date(timestamp)} />}
    </CardHeader>
    <Divider />
    <CardBody className="p-0">
      <Table
        aria-label={heading}
        className="h-[25rem] overflow-x-auto scrollbar-thin"
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
          {data.map((account) => (
            <TableRow key={account.address}>
              <TableCell>
                <BoringAvatar name={account.address} size={24} />
              </TableCell>
              <TableCell>
                <AddressLink address={account.address}>
                  <TextTruncate className="max-w-56">
                    <FMono>{account.address}</FMono>
                  </TextTruncate>
                </AddressLink>
                <CopyButton text={account.address} />
              </TableCell>
              <TableCell>{account.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardBody>
  </Card>
);

export default LeaderboardTable;
