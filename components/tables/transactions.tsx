"use client";

import { TokenLogo } from "@/components/token";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTimestamp,
} from "@/components/ui/card";
import { PRIMARY_TOKEN_TYPE } from "@/constants/stablecoins";
import { useTransactions } from "@/hooks/explorer/transactions";
import { usePaginator } from "@/hooks/paginator";
import { SerializedTokenData, TokenType } from "@/lib/token";
import {
  Button,
  Calendar,
  Chip,
  Divider,
  table as hTable,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowRight, CalendarSearch, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import TimeAgo from "react-timeago";
import CopyButton from "../copy-button";
import { AddressLink, BlockLink, TransactionLink } from "../links";
import TablePaginator from "../table-paginator";
import { FMono, TextTruncate } from "../text";
import { tableClassNames } from "../ui/table";
import DownloadButton from "../download-button";

type Transaction = ArrayType<
  NonNullable<ReturnType<typeof useTransactions>["data"]>["data"]
>;

const columns: ColumnDef<Transaction>[] = [
  {
    header: "Txn Hash",
    accessorKey: "transaction_hash",
    cell(props) {
      const hash = props.getValue() as string;
      return (
        <div className="flex items-center gap-2">
          <TransactionLink hash={hash}>
            <FMono>
              <TextTruncate className="max-w-40">{hash}</TextTruncate>
            </FMono>
          </TransactionLink>
          <CopyButton text={hash} />
        </div>
      );
    },
  },
  {
    header: "Method",
    accessorKey: "event_signature",
    cell({ getValue }) {
      const signature = getValue() as string;
      return <Chip variant="faded">{signature.split("(")[0]}</Chip>;
    },
  },
  {
    header: "Block",
    accessorKey: "block_number",
    cell(props) {
      const block = props.getValue() as number;
      return (
        <BlockLink number={BigInt(block)}>
          <FMono>{block}</FMono>
        </BlockLink>
      );
    },
  },
  {
    header: "Age",
    accessorKey: "block_timestamp",
    cell({ getValue }) {
      return <TimeAgo date={getValue() as string} />;
    },
  },
  {
    header: "From",
    accessorKey: "from_address",
    cell({ getValue }) {
      const address = getValue() as string;
      return (
        <div className="flex items-center gap-2">
          <AddressLink address={address}>
            <FMono>
              <TextTruncate className="max-w-40">{address}</TextTruncate>
            </FMono>
          </AddressLink>
          <CopyButton text={address} />
        </div>
      );
    },
  },
  {
    header: "",
    id: "icon",
    cell: () => (
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-blue-700/15 bg-blue-700/10">
        <ArrowRight size={12} className="text-blue-700" />
      </span>
    ),
  },
  {
    header: "To",
    accessorKey: "to_address",
    cell({ getValue }) {
      const address = getValue() as string;
      return (
        <div className="flex items-center gap-2">
          <AddressLink address={address}>
            <FMono>
              <TextTruncate className="max-w-40">{address}</TextTruncate>
            </FMono>
          </AddressLink>
          <CopyButton text={address} />
        </div>
      );
    },
  },
  {
    header: "Amount",
    accessorKey: "quantity",
    cell({ getValue }) {
      const qty = getValue() as string;
      return PRIMARY_TOKEN_TYPE.applySubunits(qty);
    },
  },
];

const getISODate = (date: Date) => parseDate(date.toISOString().split("T")[0]);

type TransactionsTableProps = {
  tokenData: SerializedTokenData;
};

const TransactionsTable: React.FC<TransactionsTableProps> = ({ tokenData }) => {
  const token = new TokenType(tokenData);
  const [date, setDate] = useState(new Date());
  const { base, table, thead, tbody, tr, th, td } = hTable({});

  const { setTotalPages, ...pagination } = usePaginator({
    initialPage: 1,
    initialPageSize: 10,
    initialPageSizes: [10, 25, 50, 100],
  });

  const query = useTransactions({
    date,
    page: pagination.page,
    limit: pagination.pageSize,
    tokenAddress: token.getContractAddress(),
  });

  const data = useMemo(() => query.data?.data ?? [], [query.data]);

  const rTable = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (query.data) {
      setTotalPages(() => query.data.meta.totalPages);
    }
  }, [query.data]);

  return (
    <div className="m-2">
      <Card>
        <CardHeader>
          <TokenLogo token={token.toJSON()} className="h-5 w-5" />
          <CardHeading>{token.getSymbol()} Transactions</CardHeading>
          <CardTimestamp
            date={
              query.data?.timestamp ? new Date(query.data.timestamp) : undefined
            }
            isRefreshing={query.isFetching}
            frequency={15 * 60}
          />
          {query.data && (
            <DownloadButton
              data={query.data.data}
              filename={`pyusd-transaction-${date.toDateString()}`}
              variant="faded"
            >
              <Download size={16} /> Download Page Data
            </DownloadButton>
          )}
          <Popover placement="right">
            <PopoverTrigger>
              <Button variant="faded" isIconOnly>
                <CalendarSearch size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                aria-label="Date (Uncontrolled)"
                // @ts-expect-error ....
                value={getISODate(date)}
                onChange={(d) => {
                  // @ts-expect-error ....
                  setDate(new Date(d.toString()));
                }}
              />
            </PopoverContent>
          </Popover>
        </CardHeader>
        <Divider />
        <CardBody className="p-0">
          <div className={base()}>
            <table className={table({})}>
              <thead className={thead({ className: tableClassNames?.thead })}>
                {rTable.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className={tr()}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          key={header.id}
                          className={th({ className: tableClassNames?.th })}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className={tbody({ className: tableClassNames?.tbody })}>
                {rTable.getRowModel().rows?.length ? (
                  rTable.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={tr()}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className={td()}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr className={tr()}>
                    <td
                      colSpan={columns.length}
                      className={td({ className: "h-24 text-center" })}
                    >
                      No results.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="block">
          <TablePaginator {...pagination} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default TransactionsTable;
