import TokenTransferTable from "@/components/tables/token-transfers";
import { TokenLogo } from "@/components/token";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardHeading,
} from "@/components/ui/card";
import { PRIMARY_TOKEN_TYPE } from "@/constants/stablecoins";
import { isPrimaryTokenAddress } from "@/lib/validator";
import { Divider } from "@heroui/react";
import { notFound } from "next/navigation";

const TokenTransferTransactions = async (props: PageProps<{ id: string }>) => {
  const tokenAddress = (await props.params).id;
  const isPrimary = isPrimaryTokenAddress(tokenAddress);
  if (!isPrimary) notFound();
  const token = PRIMARY_TOKEN_TYPE.toJSON();

  return (
    <div className="m-2">
      <Card>
        <CardHeader>
          <TokenLogo token={token} />
          <CardHeading>
            {PRIMARY_TOKEN_TYPE.getSymbol()} Token Transfer Transactions
          </CardHeading>
        </CardHeader>
        <Divider />
        <CardBody className="p-0">
          <TokenTransferTable tokenData={token} />
        </CardBody>
        <Divider />
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default TokenTransferTransactions;
