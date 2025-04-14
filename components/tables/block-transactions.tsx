"use client";

import { usePaginator } from "@/hooks/table";
import { Divider } from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Download } from "lucide-react";
import TimeAgo from "react-timeago";
import CopyButton from "../copy-button";
import DownloadButton from "../download-button";
import { WeiToEther } from "../eth";
import { AddressLink, BlockLink, TransactionLink } from "../links";
import { FMono, TextTruncate } from "../text";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardHeading,
} from "../ui/card";
import { Paginator } from "../ui/paginator";
import { col, tableClassNames } from "../ui/table";

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
  col("Transaction Hash", "hash"),
  // { name: "Method", uid: "method" },
  col("Block", "blockNumber"),
  col("Age", "age"),
  col("From", "from"),
  col("To", "to"),
  col("Amount", "amount"),
  // { name: "Txn Fee", uid: "fee" },
];

type BlockTransactionsTableProps = { data: TRowData[]; block: string };

const BlockTransactionsTable = ({
  data,
  block,
}: BlockTransactionsTableProps) => {
  const paginator = usePaginator({
    data,
    defaultPage: 1,
    defaultPageSize: 10,
    pageSizes: [10, 25, 50, 100],
  });

  return (
    <section className="m-4">
      <header className="mb-4 font-serif text-2xl">
        <span className="me-2 font-bold">Transactions of Block </span>
        <span className="text-lg text-gray-400">
          # <BlockLink number={BigInt(block)}>{block}</BlockLink>
        </span>
      </header>
      <div>
        <Card>
          <CardHeader>
            <CardHeading className="group-hover:text-foreground">
              A total of {data.length} transaction found
            </CardHeading>
            <DownloadButton
              variant="faded"
              key={`${paginator.page}-${paginator.pageSize}`}
              className="ms-auto"
              data={paginator.pageData}
              filename={`block-${block}-transactions-page-${paginator.page}.csv`}
            >
              <Download size={16} />
              Download Page Data
            </DownloadButton>
            <Paginator paginator={paginator} showSelect={false} />
          </CardHeader>
          <Divider />
          <CardBody className="p-0">
            <Table
              aria-label="eth blocks table"
              classNames={tableClassNames}
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
                {paginator.pageData.map((tx) => (
                  <TableRow key={tx.hash}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FMono>
                          <TextTruncate className="w-56">
                            <TransactionLink hash={tx.hash}>
                              {tx.hash}
                            </TransactionLink>
                          </TextTruncate>
                        </FMono>
                        <CopyButton text={tx.hash} />
                      </div>
                    </TableCell>
                    {/* <TableCell>{tx.method}</TableCell> */}
                    <TableCell>{tx.blockNumber}</TableCell>
                    <TableCell>
                      <TimeAgo date={new Date(Number(tx.age) * 1000)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FMono>
                          <TextTruncate>
                            <AddressLink address={tx.from}>
                              {tx.from}
                            </AddressLink>
                          </TextTruncate>
                        </FMono>
                        <CopyButton text={tx.from} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tx.to && (
                          <>
                            <FMono>
                              <TextTruncate>
                                <AddressLink address={tx.to}>
                                  {tx.to}
                                </AddressLink>
                              </TextTruncate>
                            </FMono>
                            <CopyButton text={tx.to} />
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <WeiToEther wei={tx.amount} />
                    </TableCell>
                    {/* <TableCell>{tx.fee}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
          <Divider />
          <CardFooter className="block">
            <Paginator paginator={paginator} />
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default BlockTransactionsTable;
