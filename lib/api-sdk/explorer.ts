import { BaseFetcherOptions, fetcher, PathMakerFn } from "./fetcher";

import type {
  BlocksApiResponse,
  BlocksApiResponseQuery,
} from "@/app/api/public/mainnet/explorer/blocks/route";
import type {
  GetTransactionApiResponse,
  GetTransactionQuerySchema,
} from "@/app/api/public/mainnet/explorer/transactions/route";
import type { GetLatestTokenTransferApiResponse } from "@/app/api/public/mainnet/explorer/transactions/tokens/[id]/latest/route";

export function createMainnetExplorer(_URL: PathMakerFn) {
  const getBlocks = (
    query: BlocksApiResponseQuery,
    opts: BaseFetcherOptions = {},
  ) => {
    const url = _URL("/mainnet/explorer/blocks");
    url.searchParams.set("limit", query.limit);
    url.searchParams.set("cursor", query.cursor ?? "undefined");
    return fetcher<BlocksApiResponse>(url, {
      ...opts,
    });
  };

  const getTransactions = async (
    query: GetTransactionQuerySchema,
    opts: BaseFetcherOptions = {},
  ) => {
    const url = _URL("/mainnet/explorer/transactions");
    url.searchParams.set("tokenAddress", query.tokenAddress);
    url.searchParams.set("date", query.date.toISOString());
    url.searchParams.set("limit", query.limit.toString());
    url.searchParams.set("page", query.page.toString());
    return fetcher<GetTransactionApiResponse>(url, { ...opts });
  };

  const getLatestTokenTransfers = async (
    tokenAddress: string,
    opts: BaseFetcherOptions = {},
  ) => {
    const url = _URL(
      `/mainnet/explorer/transactions/tokens/${tokenAddress}/latest`,
    );
    return fetcher<GetLatestTokenTransferApiResponse>(url, {
      ...opts,
    });
  };

  return {
    getBlocks,
    getTransactions,
    getLatestTokenTransfers,
  };
}
