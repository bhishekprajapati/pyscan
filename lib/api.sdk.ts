/**
 * This module exports api sdk for all,
 * the backend api routes for the frontend.
 */
"use client";

import type { GetTopHoldersApiResponse } from "@/app/api/public/explorer/mainnet/analytics/top-holders/route";
import type { GetTransferCountsApiResponse } from "@/app/api/public/explorer/mainnet/analytics/transfer-counts/route";
import type { BlocksApiResponse } from "@/app/api/public/explorer/mainnet/blocks/route";
import type { GetTransactionsApiResponse } from "@/app/api/public/explorer/mainnet/transactions/route";
import type { GetTransferApiResponse } from "@/app/api/public/explorer/mainnet/transfers/route";
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

type BaseOptions = Pick<RequestInit, "signal">;

type CreateClientOptions = {
  baseUrl?: string;
};

const createClient = (opts: CreateClientOptions = {}) => {
  const { baseUrl } = opts;
  const _URL = (path: string) =>
    new URL(path, baseUrl ?? window.location.origin);

  const getPrivateMethods = () => {
    const queries = (() => {
      const exec = async (query: string, opts: BaseOptions = {}) => {
        try {
          const res = await fetch(_URL("/api/queries/execute"), {
            method: "POST",
            body: JSON.stringify({ query }),
            ...opts,
          });
          const json = (await res.json()) as ExecuteQueryApiResponse;
          return json;
        } catch (err) {
          console.error(err);
          return error({
            name: "unknown-error",
            message: "Something went wrong",
          });
        }
      };

      return {
        exec,
      };
    })();

    return {
      queries,
    } as const;
  };

  const getPublicMethods = () => {
    const explorer = (() => {
      const mainnet = (() => {
        type GetBlocksParams = {
          limit?: "10" | "25" | "50" | "100";
        };
        const getBlocks = async (
          params: GetBlocksParams = {},
          opts: BaseOptions = {},
        ) => {
          try {
            const url = _URL("/api/public/explorer/mainnet/blocks");
            url.searchParams.set("limit", params?.limit ?? "10");
            const res = await fetch(url, {
              ...opts,
            });
            const json = (await res.json()) as BlocksApiResponse;
            return json;
          } catch (err) {
            console.error(err);
            return error({
              name: "unknown-error",
              message: "Something went wrong",
            });
          }
        };

        type GetTransactionsParams = {};
        const getTransactions = async (
          params: GetBlocksParams,
          opts: BaseOptions = {},
        ) => {
          try {
            const url = _URL("/api/public/explorer/mainnet/transactions");
            const res = await fetch(url, {
              ...opts,
            });
            const json = (await res.json()) as GetTransactionsApiResponse;
            return json;
          } catch (err) {
            console.error(err);
            return error({
              name: "unknown-error",
              message: "Something went wrong",
            });
          }
        };

        type GetTransfersParams = {};
        const getTransfers = async (
          params: GetTransfersParams,
          opts: BaseOptions = {},
        ) => {
          try {
            const url = _URL("/api/public/explorer/mainnet/transfers");
            const res = await fetch(url, {
              ...opts,
            });
            const json = (await res.json()) as GetTransferApiResponse;
            return json;
          } catch (err) {
            console.error(err);
            return error({
              name: "unknown-error",
              message: "Something went wrong",
            });
          }
        };

        const analytics = (() => {
          type GetTopHoldersParams = {};
          const getTopHolders = async (
            params: GetTopHoldersParams,
            opts: BaseOptions = {},
          ) => {
            try {
              const url = _URL(
                "/api/public/explorer/mainnet/analytics/top-holders",
              );
              const res = await fetch(url, {
                ...opts,
              });
              const json = (await res.json()) as GetTopHoldersApiResponse;
              return json;
            } catch (err) {
              console.error(err);
              return error({
                name: "unknown-error",
                message: "Something went wrong",
              });
            }
          };

          type GetTransfersCountParams = {
            timeframe: "day" | "month" | "year";
          };
          const getTransfersCount = async (
            params: GetTransfersCountParams,
            opts: BaseOptions = {},
          ) => {
            try {
              const url = _URL(
                "/api/public/explorer/mainnet/analytics/transfer-counts",
              );
              url.searchParams.set("timeframe", params.timeframe);
              const res = await fetch(url, {
                ...opts,
              });
              const json = (await res.json()) as GetTransferCountsApiResponse;
              return json;
            } catch (err) {
              console.error(err);
              return error({
                name: "unknown-error",
                message: "Something went wrong",
              });
            }
          };

          return {
            getTopHolders,
            getTransfersCount,
          } as const;
        })();

        return {
          analytics,
          getBlocks,
          getTransactions,
          getTransfers,
        } as const;
      })();

      return {
        mainnet,
      } as const;
    })();

    return {
      explorer,
    } as const;
  };

  return {
    public: getPublicMethods(),
    private: getPrivateMethods(),
  } as const;
};

export const client = createClient();
