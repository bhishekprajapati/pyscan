/**
 * This module exports api sdk for all,
 * the backend api routes for the frontend.
 */

/**
 * NOTE: To future me
 * Sole purpose of writing get functions using POST methods
 * is make my little life easier while serializing and parsing
 * nested query objects in body since using body in GET fetch calls
 * and i couldn't find any other easier way to serialize nested object as search params
 */
"use client";

import type { GetTopHoldersApiResponse } from "@/app/api/public/explorer/mainnet/analytics/top-holders/route";
import type { GetTransferCountsApiResponse } from "@/app/api/public/explorer/mainnet/analytics/transfer-counts/route";
import type { BlocksApiResponse } from "@/app/api/public/explorer/mainnet/blocks/route";
import type { GetTransactionsApiResponse } from "@/app/api/public/explorer/mainnet/transactions/route";
import type { GetTransferApiResponse } from "@/app/api/public/explorer/mainnet/transfers/route";
import type {
  PostTransactionCountsApiResponse,
  PostTransactionCountSearchQuery,
} from "@/app/api/public/mainnet/analytics/transactions/counts/route";
import type {
  GetRecieverLeaderboardApiResponse,
  GetRecieverLeaderboardQuerySchema,
} from "@/app/api/public/mainnet/analytics/volumes/leaderboards/receivers/route";
import type {
  GetSenderLeaderboardApiResponse,
  GetSenderLeaderboardQuerySchema,
} from "@/app/api/public/mainnet/analytics/volumes/leaderboards/senders/route";
import type {
  PostMintBurnApiResponse,
  PostMintBurnSearchQuery,
} from "@/app/api/public/mainnet/analytics/volumes/mint-burn/route";
import type {
  PostTokenTransferVolumeApiResponse,
  PostTokenTransferVolumeSearchQuery,
} from "@/app/api/public/mainnet/analytics/volumes/transfers/route";
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

const fetcher = async <TJsonResponse>(url: URL, init?: RequestInit) => {
  try {
    const res = await fetch(url, init);
    const json = (await res.json()) as TJsonResponse;
    return json;
  } catch (err) {
    console.error(err);
    return error({
      name: "unknown-error",
      message: "Something went wrong",
    });
  }
};

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
        const getBlocks = (
          params: GetBlocksParams = {},
          opts: BaseOptions = {},
        ) => {
          const url = _URL("/api/public/explorer/mainnet/blocks");
          url.searchParams.set("limit", params?.limit ?? "10");
          return fetcher<BlocksApiResponse>(url, {
            ...opts,
          });
        };

        type GetTransactionsParams = {};
        const getTransactions = async (
          params: GetBlocksParams,
          opts: BaseOptions = {},
        ) => {
          const url = _URL("/api/public/explorer/mainnet/transactions");
          return fetcher<GetTransactionsApiResponse>(url, { ...opts });
        };

        type GetTransfersParams = {};
        const getTransfers = async (
          params: GetTransfersParams,
          opts: BaseOptions = {},
        ) => {
          const url = _URL("/api/public/explorer/mainnet/transfers");
          return fetcher<GetTransferApiResponse>(url, {
            ...opts,
          });
        };

        const analytics = (() => {
          type GetTopHoldersParams = {};
          const getTopHolders = async (
            params: GetTopHoldersParams,
            opts: BaseOptions = {},
          ) => {
            const url = _URL(
              "/api/public/explorer/mainnet/analytics/top-holders",
            );
            return fetcher<GetTopHoldersApiResponse>(url, {
              ...opts,
            });
          };

          type GetTransfersCountParams = {
            timeframe: "day" | "month" | "year";
          };
          const getTransfersCount = async (
            params: GetTransfersCountParams,
            opts: BaseOptions = {},
          ) => {
            const url = _URL(
              "/api/public/explorer/mainnet/analytics/transfer-counts",
            );
            url.searchParams.set("timeframe", params.timeframe);
            return fetcher<GetTransferCountsApiResponse>(url, {
              ...opts,
            });
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

    const mainnet = (() => {
      const analytics = (() => {
        const getHolderCounts = async (opts: BaseOptions = {}) => {
          const url = _URL("/api/public/mainnet/analytics/holders/counts");
          return fetcher<any>(url, {
            ...opts,
          });
        };

        const getTxnCounts = async (
          query: PostTransactionCountSearchQuery,
          opts: BaseOptions = {},
        ) => {
          const url = _URL("/api/public/mainnet/analytics/transactions/counts");
          return fetcher<PostTransactionCountsApiResponse>(url, {
            method: "POST",
            body: JSON.stringify(query),
            ...opts,
          });
        };

        const getMintBurnVol = async (
          query: PostMintBurnSearchQuery,
          opts: BaseOptions = {},
        ) => {
          const url = _URL("/api/public/mainnet/analytics/volumes/mint-burn");
          return fetcher<PostMintBurnApiResponse>(url, {
            method: "POST",
            body: JSON.stringify(query),
            ...opts,
          });
        };

        const getTokenTransferVol = async (
          query: PostTokenTransferVolumeSearchQuery,
          opts: BaseOptions = {},
        ) => {
          const url = _URL("/api/public/mainnet/analytics/volumes/transfers");
          return fetcher<PostTokenTransferVolumeApiResponse>(url, {
            method: "POST",
            body: JSON.stringify(query),
            ...opts,
          });
        };

        const getRecieverLeaderboardVol = async (
          query: GetRecieverLeaderboardQuerySchema,
          opts: BaseOptions = {},
        ) => {
          const url = _URL(
            "/api/public/mainnet/analytics/volumes/leaderboards/receivers",
          );
          url.searchParams.set("tokenAddress", query.tokenAddress);
          return fetcher<GetRecieverLeaderboardApiResponse>(url, {
            method: "GET",
            ...opts,
          });
        };

        const getSenderLeaderboardVol = async (
          query: GetSenderLeaderboardQuerySchema,
          opts: BaseOptions = {},
        ) => {
          const url = _URL(
            "/api/public/mainnet/analytics/volumes/leaderboards/senders",
          );
          url.searchParams.set("tokenAddress", query.tokenAddress);
          return fetcher<GetSenderLeaderboardApiResponse>(url, {
            method: "GET",
            ...opts,
          });
        };

        return {
          getHolderCounts,
          getTxnCounts,
          getMintBurnVol,
          getTokenTransferVol,
          getRecieverLeaderboardVol,
          getSenderLeaderboardVol,
        };
      })();

      return {
        analytics,
      } as const;
    })();

    return {
      explorer,
      mainnet,
    } as const;
  };

  return {
    public: getPublicMethods(),
    private: getPrivateMethods(),
  } as const;
};

export const client = createClient();
