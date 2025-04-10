import { cn } from "@heroui/react";
import Link from "next/link";
import { DataId } from "./data-id";

type BaseLinkProps = Omit<
  React.ComponentPropsWithoutRef<typeof Link>,
  "href"
> & { dataId?: boolean };

type BlockLinkProps = { number: bigint } & BaseLinkProps;

export const BlockLink = (props: BlockLinkProps) => {
  const { number, dataId, className, ...rest } = props;
  return dataId ? (
    <DataId dataId={number.toString()}>
      <Link
        href={`/blocks/${number.toString()}`}
        className={cn(className, "text-blue-400 hover:text-blue-300")}
        {...rest}
      />
    </DataId>
  ) : (
    <Link
      href={`/blocks/${number.toString()}`}
      className={cn(className, "text-blue-400 hover:text-blue-300")}
      {...rest}
    />
  );
};

type TransactionLinkProps = { hash: string } & BaseLinkProps;
export const TransactionLink = (props: TransactionLinkProps) => {
  const { hash, dataId, className, ...rest } = props;
  return dataId ? (
    <DataId dataId={hash}>
      <Link
        href={`/transactions/${hash}`}
        className={cn(className, "text-blue-400 hover:text-blue-300")}
        {...rest}
      />
    </DataId>
  ) : (
    <Link
      href={`/transactions/${hash}`}
      className={cn(className, "text-blue-400 hover:text-blue-300")}
      {...rest}
    />
  );
};

type AddressLinkProps = { address: string } & BaseLinkProps;
export const AddressLink = (props: AddressLinkProps) => {
  const { address, dataId = true, className, ...rest } = props;
  return dataId ? (
    <DataId dataId={address}>
      <Link
        href={`/addresses/${address}`}
        className={cn(
          className,
          "inline-block text-blue-400 hover:text-blue-300",
        )}
        {...rest}
      />
    </DataId>
  ) : (
    <Link
      href={`/addresses/${address}`}
      className={cn(
        className,
        "inline-block text-blue-400 hover:text-blue-300",
      )}
      {...rest}
    />
  );
};

type BlockTransactionsLinkProps = { number: bigint } & BaseLinkProps;
export const BlockTransactionsLink = (props: BlockTransactionsLinkProps) => {
  const { number, className, ...rest } = props;
  return (
    <Link
      href={`/blocks/${number}/transactions`}
      className={cn(className, "text-blue-400 hover:text-blue-300")}
      {...rest}
    />
  );
};
