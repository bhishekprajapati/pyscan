import { Chip, Skeleton } from "@heroui/react";
import { Fuel } from "lucide-react";
import { Suspense } from "react";

import { RenderUserAvatar } from "./auth/user";
import Nav from "./nav";
import { PathOnly } from "./path";
import { EthGasFee, Quote } from "./pyusd";
import LinkButton from "./ui/link-button";

const AppNavBar = ({ slotInput }: { slotInput?: React.ReactNode }) => {
  return (
    <nav className="border-y border-y-divider bg-background/75 backdrop-blur-xl">
      <header className="flex items-center">
        <div className="me-auto border-e border-e-divider p-4 md:me-0">
          <LinkButton href="/" variant="light" size="sm">
            <span className="font-serif text-xl font-bold text-primary">
              PyScan
            </span>
          </LinkButton>
        </div>
        <div className="border-e border-e-divider p-4">
          <div className="hidden rounded-lg bg-zinc-900 p-1 sm:block">
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
        <div className="hidden md:block">
          <Nav />
        </div>
        <span className="ms-auto" />
        <PathOnly matcher="/">
          <span className="hidden md:inline-block">
            <Chip variant="dot" color="success" className="me-4">
              Eth - Mainnet
            </Chip>
          </span>
        </PathOnly>
        {slotInput}
        <RenderUserAvatar />
      </header>
    </nav>
  );
};

export default AppNavBar;
