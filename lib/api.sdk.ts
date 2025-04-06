/**
 * This module exports api sdk for all,
 * the backend api routes for the frontend.
 */
"use client";

import type { ExecuteQueryApiResponse } from "@/app/api/queries/execute/route";

const data = <T>(d: T) => ({
  ok: true as const,
  data: d,
});

export type TError<T extends string> = {
  name: T;
  message: string;
};

const error = <T extends string>(error: TError<T>) => ({
  ok: false as const,
  error,
});

export type ApiFnReturnType<TData, TErrorName extends string> = Promise<
  { ok: true; data: TData } | { ok: false; error: TError<TErrorName> }
>;

const queries = (() => {
  const exec = async (query: string) => {
    try {
      const res = await fetch("/api/queries/execute", {
        method: "POST",
        body: JSON.stringify({ query }),
      });
      const json = (await res.json()) as ExecuteQueryApiResponse;
      return json;
    } catch (err) {
      console.error(err);
      return error({ name: "unknown-error", message: "Something went wrong" });
    }
  };

  return {
    exec,
  };
})();

const createClient = () =>
  ({
    queries,
  }) as const;

export const client = createClient();
