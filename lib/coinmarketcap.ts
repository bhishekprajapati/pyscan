import env from "@/env";

const data = <T>(data: T) => ({
  success: true as const,
  data,
});

type ClientError<T extends string> = {
  name: T;
  message?: string;
  fatal?: boolean;
  isInternal?: boolean;
  originalErr?: unknown;
};

const error = <T extends string>(err: ClientError<T>) => ({
  success: false as const,
  err: {
    name: err.name,
    message: err.message === undefined ? "Failed to fetch data" : err.message,
    isInternal: err.isInternal ?? true,
    originalErr: err.originalErr,
    fatal: err.fatal === undefined ? false : err.fatal,
  },
});

const BASE_URL = "https://pro-api.coinmarketcap.com";

const cmc = (() => {
  const baseHeaders = new Headers();
  baseHeaders.set("X-CMC_PRO_API_KEY", env.COINMARKET_API_KEY);
  baseHeaders.set("Accept", "application/json");
  baseHeaders.set("Accept-Encoding", "deflate, gzip");

  return async <TData = unknown>(
    url: Parameters<typeof fetch>["0"],
    init: Parameters<typeof fetch>["1"] = {},
  ) => {
    const { headers: setHeaders, ...restInit } = init;
    try {
      const res = await fetch(url, {
        ...restInit,
        headers: baseHeaders,
      });
      const json = await res.json();

      if (!res.ok) {
        const { status } = res;

        const err = json as {
          statusCode: number;
          error: string;
          message: string;
        };

        switch (status) {
          case 401:
          case 402:
          case 403:
            return error({
              name: "api-key-error",
              message: err.message,
              fatal: true,
            });
          case 429:
            return error({
              name: "rate-limit-error",
              message: err.message,
              fatal: true,
            });
          default:
            return error({
              name: "cmc-api-unknown-error",
              message: err.message,
              fatal: true,
            });
        }
      }

      type DataResponse<TData> = {
        data: TData;
        status: {
          timestamp: string;
          credit_count: number;
        };
      };

      return data((json as DataResponse<TData>).data);
    } catch (err) {
      return error({
        name: "unknown",
        message: "something went while fetching",
        isInternal: false,
        originalErr: err,
      });
    }
  };
})();

export const pyusd = (() => {
  const SYMBOL = "PYUSD";

  const getQuote = async () => {
    const url = new URL("/v2/cryptocurrency/quotes/latest?symbol", BASE_URL);
    url.searchParams.set("symbol", SYMBOL);

    type Data = {
      PYUSD: [
        {
          id: number;
          name: string;
          symbol: string;
          slug: string;
          is_active: 1 | 0;
          is_fiat: 1 | 0;
          circulating_supply: number;
          total_supply: number;
          max_supply: number;
          date_added: string;
          num_market_pairs: number;
          cmc_rank: number;
          last_updated: string;
          tags: string[];
          platform: null;
          self_reported_circulating_supply: null;
          self_reported_market_cap: null;
          quote: {
            USD: {
              price: number;
              volume_24h: number;
              volume_change_24h: number;
              percent_change_1h: number;
              percent_change_24h: number;
              percent_change_7d: number;
              percent_change_30d: number;
              market_cap: number;
              market_cap_dominance: number;
              fully_diluted_market_cap: number;
              last_updated: string;
            };
          };
        },
      ];
    };

    return cmc<Data>(url);
  };

  const getInfo = async () => {
    const url = new URL("/v2/cryptocurrency/info", BASE_URL);
    url.searchParams.set("symbol", SYMBOL);
    return cmc(url);
  };

  return {
    getQuote,
    getInfo,
  } as const;
})();
