"use client";

import CopyButton from "@/components/copy-button";
import { AddressLink } from "@/components/links";
import { FMono, TextTruncate } from "@/components/text";
import { usePrimaryTokenType } from "@/hooks/tokens";
import { useSenderLeaderboard } from "@/hooks/volume";
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
import TimeAgo from "react-timeago";

const columns = [
  { name: "", uid: "avatar" },
  { name: "Wallet Address", uid: "address" },
  { name: "Amount", uid: "amount" },
];

const SendersLeaderboard = () => {
  const tk = usePrimaryTokenType();
  const { query } = useSenderLeaderboard(tk);
  const data = query.data?.dataset ?? [];
  const timestamp = query.data?.timestamp;

  return (
    <div className="overflow-hidden rounded-xl bg-primary-100 bg-opacity-[0.04]">
      <h2 className="flex justify-between p-4">
        <FMono>
          Senders Leaderboard{" "}
          <span className="text-default-400"> (🔥 Last 24 Hours)</span>
        </FMono>
        <FMono className="ms-auto dark:text-default-200">
          {timestamp && <TimeAgo date={new Date(timestamp)} />}
        </FMono>
      </h2>
      <Divider />
      <Table
        aria-label="senders leaderboard"
        className="h-96 overflow-x-auto rounded-xl bg-default"
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
    </div>
  );
};
export default SendersLeaderboard;
