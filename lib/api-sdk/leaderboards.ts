import { BaseFetcherOptions, fetcher, PathMakerFn } from "./fetcher";
import type {
  GetRecieverLeaderboardApiResponse,
  GetRecieverLeaderboardQuerySchema,
} from "@/app/api/public/mainnet/leaderboards/receivers/page";
import type {
  GetSenderLeaderboardApiResponse,
  GetSenderLeaderboardQuerySchema,
} from "@/app/api/public/mainnet/leaderboards/senders/page";

export function createMainnetLeaderboards(_URL: PathMakerFn) {
  const getRecieverLeaderboardVol = async (
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

  const getSenderLeaderboardVol = async (
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

  return {
    getRecieverLeaderboardVol,
    getSenderLeaderboardVol,
  };
}
