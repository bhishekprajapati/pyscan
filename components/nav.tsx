"use client";

import Link from "next/link";
import { SignedInClientOnly } from "./auth/client";

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
    <li>
      <Link href="/leaderboards">🔥 Leaderboards</Link>
    </li>
    <SignedInClientOnly>
      <li>
        <Link href="/queries">My Queries</Link>
      </li>
    </SignedInClientOnly>
  </ul>
);

export default Nav;
