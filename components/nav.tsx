"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Nav = () => (
  <ul className="me-auto hidden gap-4 border-e border-e-divider p-4 md:flex">
    <li>
      <Link color="foreground" href="/">
        Explorer
      </Link>
    </li>
    <li>
      <Link href="/analytics">Analytics</Link>
    </li>
    <li>{/* <Link href="/Calculators">Calculator</Link> */}</li>
  </ul>
);

export default Nav;
