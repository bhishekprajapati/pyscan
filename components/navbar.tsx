"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Input, Link } from "@heroui/react";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "./theme-switcher";

const AppNavBar = () => {
  const path = usePathname();
  // TODO: add loading bar

  return (
    <nav className="border-b border-b-divider">
      <header className="flex">
        <div className="me-auto border-e border-e-divider p-4">
          <span className="text-xl font-bold text-secondary">PyScan</span>
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
