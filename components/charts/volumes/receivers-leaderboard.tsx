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
import { usePrimaryTokenType } from "@/hooks/tokens";
import { useReceiverLeaderboard } from "@/hooks/volume";
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
  { name: "Amount", uid: "amount" },
];
const ReceiversLeaderboard = () => {
  const tk = usePrimaryTokenType();
  const { query } = useReceiverLeaderboard(tk);
  const data = query.data?.dataset ?? [];
  const timestamp = query.data?.timestamp;

  return (
    <Card>
      <CardHeader>
        <CardHeading>Receivers Leaderboard</CardHeading>
        <span className="text-default-400">(🔥 Last 24 Hours)</span>
        {timestamp && <CardTimestamp date={new Date(timestamp)} />}
      </CardHeader>
      <Divider />
      <CardBody className="p-0">
        <Table
          aria-label="receivers leaderboard"
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
                <TableCell>{account.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default ReceiversLeaderboard;
