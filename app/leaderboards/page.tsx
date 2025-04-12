import ReceiversLeaderboard from "@/components/charts/volumes/receivers-leaderboard";
import SendersLeaderboard from "@/components/charts/volumes/senders-leaderboard";

export default function analytics() {
  return (
    <div className="m-4 grid auto-rows-auto gap-4 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <SendersLeaderboard />
      </div>
      <div className="lg:col-span-6">
        <ReceiversLeaderboard />
      </div>
    </div>
  );
}
