import { BaseFetcherOptions, fetcher, PathMakerFn } from "./fetcher";

import type { GetTopHoldersApiResponse } from "@/app/api/public/mainnet/analytics/top-holders/route";
import type {
  PostTransactionCountsApiResponse,
  PostTransactionCountSearchQuery,
} from "@/app/api/public/mainnet/analytics/transactions/counts/route";
import type { GetTransferCountsApiResponse } from "@/app/api/public/mainnet/analytics/transfer-counts/route";
import type {
  PostMintBurnApiResponse,
  PostMintBurnSearchQuery,
} from "@/app/api/public/mainnet/analytics/volumes/mint-burn/route";
import type {
  PostTokenTransferVolumeApiResponse,
  PostTokenTransferVolumeSearchQuery,
} from "@/app/api/public/mainnet/analytics/volumes/transfers/route";

export function createMainnetAnalytics(_URL: PathMakerFn) {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  type GetTopHoldersParams = {};
  const getTopHolders = async (
    params: GetTopHoldersParams,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    opts: BaseFetcherOptions = {},
  ) => {
    const url = _URL("/mainnet/analytics/top-holders");
    return fetcher<GetTopHoldersApiResponse>(url, {
      ...opts,
    });
  };

  type GetTransfersCountParams = {
    timeframe: "day" | "month" | "year";
  };
  const getTransfersCount = async (
    params: GetTransfersCountParams,
    opts: BaseFetcherOptions = {},
  ) => {
    const url = _URL("/mainnet/analytics/transfer-counts");
    url.searchParams.set("timeframe", params.timeframe);
    return fetcher<GetTransferCountsApiResponse>(url, {
      ...opts,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const getHolderCounts = async (opts: BaseFetcherOptions = {}) => {
    const url = _URL("/mainnet/analytics/holders/counts");
    return fetcher<unknown>(url, {
      ...opts,
    });
  };

  const getTxnCounts = async (
    query: PostTransactionCountSearchQuery,
    opts: BaseFetcherOptions = {},
  ) => {
    const url = _URL("/mainnet/analytics/transactions/counts");
    return fetcher<PostTransactionCountsApiResponse>(url, {
      method: "POST",
      body: JSON.stringify(query),
      ...opts,
    });
  };

  const getMintBurnVol = async (
    query: PostMintBurnSearchQuery,
    opts: BaseFetcherOptions = {},
  ) => {
    const url = _URL("/mainnet/analytics/volumes/mint-burn");
    return fetcher<PostMintBurnApiResponse>(url, {
      method: "POST",
      body: JSON.stringify(query),
      ...opts,
    });
  };

  const getTokenTransferVol = async (
    query: PostTokenTransferVolumeSearchQuery,
    opts: BaseFetcherOptions = {},
  ) => {
    const url = _URL("/mainnet/analytics/volumes/transfers");
    return fetcher<PostTokenTransferVolumeApiResponse>(url, {
      method: "POST",
      body: JSON.stringify(query),
      ...opts,
    });
  };

  return {
    getTopHolders,
    getTransfersCount,
    getHolderCounts,
    getTxnCounts,
    getMintBurnVol,
    getTokenTransferVol,
  };
}
