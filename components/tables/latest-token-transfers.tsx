"use client";

import { SerializedTokenData, TokenType } from "@/lib/token";
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
import { col, tableClassName, tableClassNames } from "../ui/table";
import { useLatestTokenTransfer } from "@/hooks/explorer/transactions";
import { useEffect, useMemo, useState } from "react";

const columns = [
  col("From", "from"),
  col("", "arrow"),
  col("To", "to"),
  col("Time", "timestamp"),
  col("Amount", "Amount"),
  col("", "eye"),
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
  tokenData: SerializedTokenData;
};

const LatestTokenTransferTable: React.FC<Props> = ({
  data,
  price,
  tokenData,
}) => {
  const token = new TokenType(tokenData);
  const latest = useLatestTokenTransfer(token.getContractAddress());
  const [transfers, setTransfers] = useState(data);
  const MAX_COUNT = data.length;

  useEffect(() => {
    if (latest.query.data === undefined) return;
    setTransfers((d) => {
      // @ts-expect-error ...
      const transfers = [...latest.query.data, ...d];
      return transfers.length > MAX_COUNT
        ? transfers.slice(0, MAX_COUNT)
        : transfers;
    });
  }, [latest.query.data]);

  // Quick fix: to duplicate key
  // I'm not proud of this since table is small and update frequency is less
  const txns = useMemo(
    () => transfers.map((t) => ({ key: crypto.randomUUID(), ...t })),
    [transfers],
  );

  return (
    <Table
      aria-label={`latest ${token.getName()} token transfers`}
      className={tableClassName}
      classNames={tableClassNames}
      removeWrapper
    >
      <TableHeader columns={columns}>
        {(col) => <TableColumn key={col.uid}>{col.name}</TableColumn>}
      </TableHeader>
      <TableBody>
        {txns.map((txn) => (
          <TableRow className="group" key={txn.key}>
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
                  stamp={txn.block_timestamp.toString()}
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
                    <FMono>{token.applySubunits(txn.quantity)} </FMono>
                    <span className="text-sm">{token.getSymbol()}</span>
                  </span>
                ) : (
                  <FMono className="text-success-700">
                    $
                    {(token.applySubunits(txn.quantity) * price).toFixed(
                      token.getSubunits(),
                    )}{" "}
                    USD
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
};

export default LatestTokenTransferTable;
