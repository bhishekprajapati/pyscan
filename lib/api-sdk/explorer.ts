import { BaseFetcherOptions, fetcher, PathMakerFn } from "./fetcher";

import type { BlocksApiResponse } from "@/app/api/public/mainnet/explorer/blocks/route";
import type { GetTransactionsApiResponse } from "@/app/api/public/mainnet/explorer/transactions/route";
import type { GetLatestTokenTransferApiResponse } from "@/app/api/public/mainnet/explorer/transactions/tokens/[id]/latest/route";
import type { GetTransferApiResponse } from "@/app/api/public/mainnet/explorer/transactions/tokens/[id]/route";

export function createMainnetExplorer(_URL: PathMakerFn) {
  type GetBlocksParams = {
    limit?: "10" | "25" | "50" | "100";
  };
  const getBlocks = (
    params: GetBlocksParams = {},
    opts: BaseFetcherOptions = {},
  ) => {
    const url = _URL("/mainnet/explorer/blocks");
    url.searchParams.set("limit", params?.limit ?? "10");
    return fetcher<BlocksApiResponse>(url, {
      ...opts,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const getTransactions = async (params: {}, opts: BaseFetcherOptions = {}) => {
    const url = _URL("/mainnet/explorer/transactions");
    return fetcher<GetTransactionsApiResponse>(url, { ...opts });
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
