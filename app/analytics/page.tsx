import GasFeeTrend from "@/components/charts/gas/fee";
import GasUsageTrend from "@/components/charts/gas/usage";
import HoldersCount from "@/components/charts/holders/counts";
import TransactionCount from "@/components/charts/transactions/count";
import MintBurnChart from "@/components/charts/volumes/mint-burn";
import ReceiversLeaderboard from "@/components/charts/volumes/receivers-leaderboard";
import SendersLeaderboard from "@/components/charts/volumes/senders-leaderboard";
import TokenTransferVolume from "@/components/charts/volumes/token-value";

export default function analytics() {
  return (
    <div className="m-4 grid auto-rows-auto gap-4 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <TokenTransferVolume />
      </div>
      <div className="lg:col-span-6">
        <TransactionCount />
      </div>
      <div className="lg:col-span-12">
        <MintBurnChart />
      </div>
      {/* <GasFeeTrend /> */}
      {/* <GasUsageTrend /> */}
      {/* <HoldersCount /> */}
      {/* <SendersLeaderboard /> */}
      {/* <ReceiversLeaderboard /> */}
    </div>
  );
}
