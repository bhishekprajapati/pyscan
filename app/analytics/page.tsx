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
    <div className="m-4 grid gap-4">
      {/* <GasFeeTrend /> */}
      {/* <GasUsageTrend /> */}
      {/* <HoldersCount /> */}
      <TransactionCount />
      <MintBurnChart />
      {/* <SendersLeaderboard /> */}
      {/* <ReceiversLeaderboard /> */}
      {/* <TokenTransferVolume /> */}
    </div>
  );
}
