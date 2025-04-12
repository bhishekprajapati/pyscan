import TransactionCount from "@/components/charts/transactions/count";
import MintBurnChart from "@/components/charts/volumes/mint-burn";
import TokenTransferVolume from "@/components/charts/volumes/token-value";

export default function analytics() {
  return (
    <div className="m-4 grid auto-rows-auto gap-4 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <TokenTransferVolume />
      </div>
      <div className="lg:col-span-4">
        <TransactionCount />
      </div>
      <div className="lg:col-span-8">
        <MintBurnChart />
      </div>
    </div>
  );
}
