"use client";

import { Chip, Input, Link } from "@heroui/react";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "./theme-switcher";
import { Fuel, Search } from "lucide-react";

const SearchInput = () => {
  return (
    <Input
      startContent={<Search size={16} />}
      variant="bordered"
      color="default"
      className="hidden w-[25%] md:flex"
      placeholder="Search by Address / Txn Hash / Block / Token / Domain Name"
    />
  );
};

const AppNavBar = () => {
  const path = usePathname();
  // TODO: add loading bar

  return (
    <nav className="border-y border-y-divider bg-background">
      <header className="flex items-center">
        <div className="me-auto border-e border-e-divider p-4 md:me-0">
          <span className="text-xl font-bold text-primary">PyScan</span>
        </div>
        <div className="border-e border-e-divider p-4">
          <div className="rounded-lg bg-zinc-900 p-1">
            <Chip
              color="default"
              startContent={<Fuel size={16} className="me-1" />}
              variant="light"
            >
              0 Gwei
            </Chip>
            <Chip
              color="default"
              startContent={
                <img
                  src="https://etherscan.io/token/images/paypalusd_32.png"
                  className="me-1 h-4 w-4 rounded-full object-contain"
                />
              }
              variant="light"
            >
              1 USD
            </Chip>
          </div>
        </div>
        <ul className="me-auto hidden gap-4 border-e border-e-divider p-4 md:flex">
          <li>
            <Link color="foreground" href="/">
              Explorer
            </Link>
          </li>
          <li>
            <Link href="/analytics">Analytics</Link>
          </li>
          <li>
            <Link href="/Calculators">Calculator</Link>
          </li>
        </ul>
        <span className="hidden md:inline-block">
          <Chip variant="dot" color="success" className="me-4">
            Eth - Mainnet
          </Chip>
        </span>
        <SearchInput />
        <ThemeSwitcher />
      </header>
    </nav>
  );
};

export default AppNavBar;
