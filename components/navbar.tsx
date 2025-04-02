import { Chip, Input, Skeleton } from "@heroui/react";
import { ThemeSwitcher } from "./theme-switcher";
import { Fuel, Search } from "lucide-react";
import LinkButton from "./ui/link-button";
import Nav from "./nav";
import { Suspense } from "react";
import { EthGasFee, Quote } from "./pyusd";

const SearchInput = () => {
  return (
    <Input
      startContent={<Search size={16} />}
      variant="flat"
      color="default"
      className="hidden w-[25%] md:flex"
      placeholder="Search by Address / Txn Hash / Block / Token / Domain Name"
    />
  );
};

const AppNavBar = () => (
  <nav className="border-y border-y-divider bg-background">
    <header className="flex items-center">
      <div className="me-auto border-e border-e-divider p-4 md:me-0">
        <LinkButton href="/" variant="light" size="sm">
          <span className="font-serif text-xl font-bold text-primary">
            PyScan
          </span>
        </LinkButton>
      </div>
      <div className="border-e border-e-divider p-4">
        <div className="rounded-lg bg-zinc-900 p-1">
          <Chip
            color="default"
            startContent={<Fuel size={16} className="me-1" />}
            variant="light"
          >
            <Suspense fallback={<Skeleton className="h-4 w-32 rounded-md" />}>
              <EthGasFee />
            </Suspense>
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
            <Suspense fallback={<Skeleton className="h-4 w-24 rounded-md" />}>
              <Quote />
            </Suspense>
          </Chip>
        </div>
      </div>
      <Nav />
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

export default AppNavBar;
