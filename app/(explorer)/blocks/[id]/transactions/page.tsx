import { pick } from "remeda";

import ethereum from "@/lib/ethereum";
import BlockTransactionsTable from "@/components/tables/block-transactions";

export const BlockTransactionsPage = async ({
  params,
}: PageProps<{ id: string }>) => {
  const { id } = await params;
  const result = await ethereum.mainnet.getBlockTransactions(id);
  // TODO: build error ui
  if (!result.success) return <>error...</>;

  const data = result.data.map((tx) => ({
    ...pick(tx, ["hash", "blockNumber", "from", "to"]),
    amount: tx.value,
    age: tx.timestamp,
    method: "",
    fee: BigInt(0),
  }));

  return <BlockTransactionsTable data={data} />;
};

export default BlockTransactionsPage;
