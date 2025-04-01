import { cn } from "@heroui/react";
import Link from "next/link";

type BaseLinkProps = Omit<React.ComponentPropsWithoutRef<typeof Link>, "href">;
type BlockLinkProps = { number: bigint } & BaseLinkProps;
export const BlockLink = ({ number, className, ...props }: BlockLinkProps) => (
  <Link
    href={`/blocks/${number.toString()}`}
    className={cn(className, "text-blue-400")}
    {...props}
  />
);

type TransactionLinkProps = { hash: string } & BaseLinkProps;
export const TransactionLink = ({
  hash,
  className,
  ...props
}: TransactionLinkProps) => (
  <Link
    href={`/transactions/${hash}`}
    className={cn(className, "text-blue-400")}
    {...props}
  />
);

type AddressLinkProps = { address: string } & BaseLinkProps;
export const AddressLink = ({
  address,
  className,
  ...props
}: AddressLinkProps) => (
  <Link
    href={`/addresses/${address}`}
    className={cn(className, "text-blue-400")}
    {...props}
  />
);
