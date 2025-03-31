"use client";

import { Chip, Divider } from "@heroui/react";
import NetworkCongestionChart from "@/components/charts/network-congestion";
import { CONTRACT_ADDRESS } from "@/constants/pyusd";
import { TransfersTable } from "@/components/tables/transfer-table";

const Overview = () => (
  <div className="md:flex">
    <div className="flex-[0.25] border-e border-e-divider">
      <div className="h-full md:flex md:flex-col">
        <div className="m-1 flex-1 bg-secondary bg-opacity-[0.02] p-4">
          <h3 className="text-foreground-500">Max Total Supply</h3>
          <p className="mb-4">672,119,685.918257 PYUSD</p>
          <h3 className="text-foreground-500">Holders</h3>
          <p className="mb-4">26,148</p>
          <h3 className="text-foreground-500">Total Transfers</h3>
          <p className="mb-4">More than 585,463</p>
        </div>
        <Divider />
        <div className="m-1 flex-1 bg-default p-4">
          <h3 className="text-foreground-500">OnChain Market Cap</h3>
          <p className="mb-4">$672,119,685.92</p>
          <h3 className="text-foreground-500">Circulating Supply Market Cap</h3>
          <p className="mb-4">$803,035,299.00</p>
        </div>
        <Divider />
        <div className="m-1 flex-1 p-4">
          <div>
            <h3 className="text-foreground-500">Token Contract</h3>
            <p className="mb-4">{CONTRACT_ADDRESS}</p>
            <Chip className="me-4" variant="dot" color="primary">
              ERC-20
            </Chip>
            <Chip variant="shadow" color="primary">
              # Stablecoin
            </Chip>
          </div>
        </div>
      </div>
    </div>
    <Divider className="md:hidden" />
    <div className="flex-[0.75]">
      <NetworkCongestionChart />
    </div>
  </div>
);

export default function Home() {
  return (
    <div>
      <Overview />
      <Divider />
      <section>
        <header className="border-e border-e-divider bg-default/50 p-4 text-default-foreground">
          <h2 className="text-xl">Token Transfers</h2>
        </header>
        <div>
          <TransfersTable />
        </div>
      </section>
    </div>
  );
}
