export const dynamic = "force-dynamic";

import CopyButton from "@/components/copy-button";
import { AddressLink } from "@/components/links";
import WalletTransactionsTable from "@/components/tables/wallet-transactions";
import { TokenLogo } from "@/components/token";
import LinkButton from "@/components/ui/link-button";
import { PRIMARY_TOKEN_TYPE } from "@/constants/stablecoins";
import ethereum, { isAddress } from "@/lib/ethereum";

import { Chip, Code, Divider, Skeleton } from "@heroui/react";
import BoringAvatar from "boring-avatars";
import { SquareArrowOutUpRight } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";
import { Address } from "viem";

export const metadata: Metadata = {
  title: "Pyscan | Address",
};

const EnsInfo = async ({ address }: { address: Address }) => {
  const result = await ethereum.mainnet.getEnsInfo(address);
  if (!result.success) return <></>;
  const { data: ens } = result;
  if (!ens) return <></>;

  return (
    <>
      <span>{ens.avatar}</span>
      <Chip
        size="lg"
        variant="bordered"
        className="ms-auto"
        endContent={
          ens.resolvedAddress ? (
            <AddressLink address={ens.resolvedAddress}>
              <SquareArrowOutUpRight size={16} />
            </AddressLink>
          ) : (
            <></>
          )
        }
      >
        {ens.name}
      </Chip>
    </>
  );
};

const Balance = async ({ address }: { address: string }) => {
  const result = await ethereum.mainnet.getBalance(address);
  if (!result.success) return <></>;
  return (
    <div className="flex items-center gap-2">
      Balance:{" "}
      <Chip
        variant="faded"
        startContent={
          <TokenLogo token={PRIMARY_TOKEN_TYPE.toJSON()} className="h-4 w-4" />
        }
      >
        {PRIMARY_TOKEN_TYPE.applySubunits(result.data.toString())} PYUSD
      </Chip>
    </div>
  );
};

type FC = React.FC<PageProps<{ id: string }>>;

const AddressPage: FC = async ({ params }) => {
  const { id } = await params;
  const isValid = isAddress(id);

  if (!isValid) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-32">
        <Code>{id}</Code>
        <p className="text-xl font-bold">Invalid address</p>
        <LinkButton href="/" size="md">
          Back To Explorer
        </LinkButton>
      </div>
    );
  }

  return (
    <section>
      <header className="border-e border-e-divider p-4 text-default-foreground">
        <div className="flex items-center gap-2">
          <BoringAvatar name={id} size={24} />
          <h2 className="text-lg">Address</h2>
          <Code className="bg-default">{id}</Code>
          <CopyButton
            text={id}
            tooltipText="Click to copy address"
            onCopyToast={{
              title: "Copied!",
              color: "success",
            }}
          />
          <span className="ms-auto" />
          <Suspense fallback={<Skeleton className="h-6 w-40 rounded-full" />}>
            <EnsInfo address={id} />
          </Suspense>
          <Suspense>
            <Balance address={id} />
          </Suspense>
        </div>
      </header>
      <Divider />
      <WalletTransactionsTable
        tokenData={PRIMARY_TOKEN_TYPE.toJSON()}
        address={id}
      />
    </section>
  );
};

export default AddressPage;
