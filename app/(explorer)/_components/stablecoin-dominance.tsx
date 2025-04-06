import StablecoinDominanceChart from "@/components/charts/stablecoin-dominance";
import { getStablecoins } from "@/lib/coinmarketcap";
import { devOnly } from "@/utils/dev";
import { unstable_cacheLife as cacheLife } from "next/cache";
import { pick } from "remeda";

const getCachedData = async () => {
  "use cache";
  cacheLife("weeks");

  const res = await getStablecoins();
  if (!res.success) {
    throw Error(res.err.message);
  }

  return {
    data: res.data.map((token) =>
      pick(token, [
        "id",
        "symbol",
        "market_cap",
        "name",
        "market_cap_dominance",
      ]),
    ),
    timestamp: Date.now(),
  };
};

const getDummyData = async (): ReturnType<typeof getCachedData> => ({
  data: [
    {
      id: 1,
      name: "Tether",
      symbol: "USDT",
      market_cap: 104_000_000_000,
      market_cap_dominance: 66.2,
    },
    {
      id: 2,
      name: "USD Coin",
      symbol: "USDC",
      market_cap: 32_000_000_000,
      market_cap_dominance: 20.4,
    },
    {
      id: 3,
      name: "Dai",
      symbol: "DAI",
      market_cap: 5_300_000_000,
      market_cap_dominance: 3.4,
    },
    {
      id: 4,
      name: "PYUSD",
      symbol: "PYUSD",
      market_cap: 200_000_000,
      market_cap_dominance: 0.13,
    },
    {
      id: 5,
      name: "TrueUSD",
      symbol: "TUSD",
      market_cap: 480_000_000,
      market_cap_dominance: 0.3,
    },
    {
      id: 6,
      name: "USDD",
      symbol: "USDD",
      market_cap: 725_000_000,
      market_cap_dominance: 0.46,
    },
  ],
  timestamp: Date.now(),
});

const StablecoinDominance = async () => {
  const fetcher = devOnly(getCachedData, getDummyData);
  const result = await fetcher();
  return <StablecoinDominanceChart {...result} />;
};

export default StablecoinDominance;
