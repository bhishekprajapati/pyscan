"use client";

import Link from "next/link";
import { SignedInClientOnly } from "./auth/client";

const Nav = () => (
  <ul className="me-auto hidden gap-4 p-4 md:flex">
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
        <Link href="/studio">Studio</Link>
      </li>
    </SignedInClientOnly>
  </ul>
);

export default Nav;
