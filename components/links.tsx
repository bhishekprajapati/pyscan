import { cn } from "@heroui/react";
import Link from "next/link";
import { DataId } from "./data-id";

type BaseLinkProps = Omit<React.ComponentPropsWithoutRef<typeof Link>, "href">;
type BlockLinkProps = { number: bigint } & BaseLinkProps;
export const BlockLink = ({ number, className, ...props }: BlockLinkProps) => (
  <DataId dataId={number.toString()}>
    <Link
      href={`/blocks/${number.toString()}`}
      className={cn(className, "text-blue-400 hover:text-blue-300")}
      {...props}
    />
  </DataId>
);

type TransactionLinkProps = { hash: string } & BaseLinkProps;
export const TransactionLink = ({
  hash,
  className,
  ...props
}: TransactionLinkProps) => (
  <DataId dataId={hash}>
    <Link
      href={`/transactions/${hash}`}
      className={cn(className, "text-blue-400 hover:text-blue-300")}
      {...props}
    />
  </DataId>
);

type AddressLinkProps = { address: string } & BaseLinkProps;
export const AddressLink = ({
  address,
  className,
  ...props
}: AddressLinkProps) => (
  <DataId dataId={address}>
    <Link
      href={`/addresses/${address}`}
      className={cn(
        className,
        "inline-block text-blue-400 hover:text-blue-300",
      )}
      {...props}
    />
  </DataId>
);

type BlockTransactionsLinkProps = { number: bigint } & BaseLinkProps;
export const BlockTransactionsLink = ({
  number,
  className,
  ...props
}: BlockTransactionsLinkProps) => (
  <Link
    href={`/blocks/${number}/transactions`}
    className={cn(className, "text-blue-400 hover:text-blue-300")}
    {...props}
  />
);
