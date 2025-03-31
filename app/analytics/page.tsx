import TransferCountChart from "@/components/charts/transfer-count";

export default function analytics() {
  return (
    <div>
      <section>
        <header className="border-e border-e-divider bg-default p-4 text-default-foreground">
          <h2 className="text-xl">Transactions</h2>
        </header>
        <div>
          <TransferCountChart />
        </div>
      </section>
      <section>
        <header className="border-e border-e-divider bg-default p-4 text-default-foreground">
          <h2 className="text-xl">Holders</h2>
        </header>
        <div>
          <TransferCountChart />
        </div>
      </section>
    </div>
  );
}
