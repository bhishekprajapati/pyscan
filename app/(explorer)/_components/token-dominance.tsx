import TokenDominanceChart, {
  TokenDominanceProps,
} from "@/components/charts/token-dominance";
import { ALL_TOKEN_TYPES } from "@/constants/stablecoins";
import { getQuote } from "@/lib/coinmarketcap";
import { unstable_cacheLife as cacheLife } from "next/cache";

const getCachedData = async () => {
  "use cache";
  cacheLife("weeks");

  const tokenTypes = ALL_TOKEN_TYPES;
  const promises = await Promise.allSettled(
    tokenTypes.map(async (tk) => {
      const result = await getQuote([tk.getSymbol()]);
      if (result.success) {
        return {
          token: tk,
          quote: result.data[tk.getSymbol()],
        };
      }
      throw Error(result.err.message);
    }),
  );

  const result: TokenDominanceProps = {
    data: promises
      .filter((p) => p.status === "fulfilled")
      .map((p) => {
        const { quote, token } = p.value;
        return {
          quote: {
            marketCapInUsd: quote[0].quote.USD.market_cap,
          },
          token: {
            name: token.getName(),
            symbol: token.getSymbol(),
            color: token.getColors("dark"),
            logo: token.getLogo(),
          },
        };
      }),
    timestamp: Date.now(),
  };

  return result;
};

const StablecoinDominance = async () => {
  const result = await getCachedData();
  return <TokenDominanceChart {...result} />;
};

export default StablecoinDominance;
