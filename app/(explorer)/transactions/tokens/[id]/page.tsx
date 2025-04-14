import TransactionsTable from "@/components/tables/transactions";
import { PRIMARY_TOKEN_TYPE } from "@/constants/stablecoins";
import { isPrimaryTokenAddress } from "@/lib/validator";
import { notFound } from "next/navigation";

const TokenTransactions = async (props: PageProps<{ id: string }>) => {
  const tokenAddress = (await props.params).id;
  const isPrimary = isPrimaryTokenAddress(tokenAddress);
  if (!isPrimary) notFound();
  const token = PRIMARY_TOKEN_TYPE.toJSON();
  return <TransactionsTable tokenData={token} />;
};

export default TokenTransactions;
