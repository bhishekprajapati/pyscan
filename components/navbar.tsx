"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Chip, Input, Link } from "@heroui/react";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "./theme-switcher";
import { Fuel } from "lucide-react";

const AppNavBar = () => {
  const path = usePathname();
  // TODO: add loading bar

  return (
    <nav className="border-b border-b-divider bg-background">
      <header className="flex items-center">
        <div className="me-auto border-e border-e-divider p-4 md:me-0">
          <span className="text-xl font-bold text-secondary">PyScan</span>
        </div>
        <div className="me-auto border-e border-e-divider p-4">
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
        <ul className="hidden gap-4 border-e border-e-divider p-4 md:flex">
          <li>
            <Link color="foreground" href="/">
              Explorer
            </Link>
          </li>
          <li>
            <Link aria-current="page" href="/analytics">
              Analytics
            </Link>
          </li>
        </ul>
        <ThemeSwitcher />
      </header>
    </nav>
  );
};

export default AppNavBar;
