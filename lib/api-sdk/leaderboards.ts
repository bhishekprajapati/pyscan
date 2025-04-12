import { BaseFetcherOptions, fetcher, PathMakerFn } from "./fetcher";
import type {
  GetRecieverLeaderboardApiResponse,
  GetRecieverLeaderboardQuerySchema,
} from "@/app/api/public/mainnet/leaderboards/receivers/route";
import type {
  GetSenderLeaderboardApiResponse,
  GetSenderLeaderboardQuerySchema,
} from "@/app/api/public/mainnet/leaderboards/senders/route";
import type {
  GetBurnLeaderboardApiResponse,
  GetBurnLeaderboardQuerySchema,
} from "@/app/api/public/mainnet/leaderboards/burns/route";
import type {
  GetHolderLeaderboardApiResponse,
  GetHolderLeaderboardQuerySchema,
} from "@/app/api/public/mainnet/leaderboards/holders/route";

export function createMainnetLeaderboards(_URL: PathMakerFn) {
  const getTopReceivers = async (
    query: GetRecieverLeaderboardQuerySchema,
    opts: BaseFetcherOptions = {},
  ) => {
    const url = _URL("/mainnet/leaderboards/receivers");
    url.searchParams.set("tokenAddress", query.tokenAddress);
    return fetcher<GetRecieverLeaderboardApiResponse>(url, {
      method: "GET",
      ...opts,
    });
  };

  const getTopSenders = async (
    query: GetSenderLeaderboardQuerySchema,
    opts: BaseFetcherOptions = {},
  ) => {
    const url = _URL("/mainnet/leaderboards/senders");
    url.searchParams.set("tokenAddress", query.tokenAddress);
    return fetcher<GetSenderLeaderboardApiResponse>(url, {
      method: "GET",
      ...opts,
    });
  };

  const getTopBurners = async (
    query: GetBurnLeaderboardQuerySchema,
    opts: BaseFetcherOptions = {},
  ) => {
    const url = _URL("/mainnet/leaderboards/senders");
    url.searchParams.set("tokenAddress", query.tokenAddress);
    return fetcher<GetBurnLeaderboardApiResponse>(url, {
      method: "GET",
      ...opts,
    });
  };

  const getTopHolders = async (
    query: GetHolderLeaderboardQuerySchema,
    opts: BaseFetcherOptions = {},
  ) => {
    const url = _URL("/mainnet/leaderboards/senders");
    url.searchParams.set("tokenAddress", query.tokenAddress);
    return fetcher<GetHolderLeaderboardApiResponse>(url, {
      method: "GET",
      ...opts,
    });
  };

  return {
    getTopBurners,
    getTopHolders,
    getTopSenders,
    getTopReceivers,
  };
}
