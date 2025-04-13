import { BaseFetcherOptions, fetcher, PathMakerFn } from "./fetcher";

import type {
  BlocksApiResponse,
  BlocksApiResponseQuery,
} from "@/app/api/public/mainnet/explorer/blocks/route";
import type { GetLatestTokenTransferApiResponse } from "@/app/api/public/mainnet/explorer/transactions/tokens/[id]/latest/route";
import type { GetTransferApiResponse } from "@/app/api/public/mainnet/explorer/transactions/tokens/[id]/route";

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

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const getTransactions = async (params: {}, opts: BaseFetcherOptions = {}) => {
    const url = _URL("/mainnet/explorer/transactions");
    return fetcher<unknown>(url, { ...opts });
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const getTransfers = async (
    params: { tokenAddress: string },
    opts: BaseFetcherOptions = {},
  ) => {
    const url = _URL(
      `/mainnet/explorer/transactions/tokens/${params.tokenAddress}`,
    );
    return fetcher<GetTransferApiResponse>(url, {
      ...opts,
    });
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
    getTransfers,
    getLatestTokenTransfers,
  };
}
