import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./lib/db/index";
import { balances } from "./lib/db/schema";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [Google],
  session: {
    strategy: "jwt",
  },
  events: {
    async createUser({ user }) {
      if (!user.id) return;
      await db.insert(balances).values({
        userId: user.id,
        bytes: BigInt(1024 * 1024 * 1024 * 10),
      });
    },
  },
});
