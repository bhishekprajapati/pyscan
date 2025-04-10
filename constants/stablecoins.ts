import { TokenType } from "@/lib/token";

/**
 * Primary token for the app
 */
export const PRIMARY_TOKEN_TYPE = new TokenType({
  name: "PayPal USD",
  symbol: "PYUSD",
  logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/27772.png",
  colors: {
    dark: {
      background: "#3b6bed",
      foreground: "#f9feff",
    },
    light: {
      background: "#3b6bed",
      foreground: "#f9feff",
    },
  },
  subunits: 6,
  address: "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8",
});

export const SECONDARY_TOKEN_TYPES = [
  new TokenType({
    name: "Tether",
    symbol: "USDT",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
    colors: {
      dark: {
        background: "#009491",
        foreground: "#f9fcfa",
      },
      light: {
        background: "#009491",
        foreground: "#f9fcfa",
      },
    },
    subunits: 6,
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  }),
  new TokenType({
    name: "USDC",
    symbol: "USDC",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
    colors: {
      dark: {
        background: "#2575d1",
        foreground: "#fffefa",
      },
      light: {
        background: "#2575d1",
        foreground: "#fffefa",
      },
    },
    subunits: 6,
    address: "0xA0b86991c6218B36c1D19D4a2e9Eb0cE3606eB48",
  }),
  new TokenType({
    name: "Dai",
    symbol: "DAI",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png",
    colors: {
      dark: {
        background: "#f9b120",
        foreground: "#f1fff5",
      },
      light: {
        background: "#f9b120",
        foreground: "#f1fff5",
      },
    },
    subunits: 18,
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  }),
  new TokenType({
    name: "First Digital USD",
    symbol: "FDUSD",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/26081.png",
    colors: {
      dark: {
        background: "#040404",
        foreground: "#efeff2",
      },
      light: {
        background: "#040404",
        foreground: "#efeff2",
      },
    },
    subunits: 18,
    address: "0xc5f0f7b66764f6ec8c8dff7ba683102295e16409",
  }),
  new TokenType({
    name: "TrueUSD",
    symbol: "TUSD",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/2563.png",
    colors: {
      dark: {
        background: "#185aff",
        foreground: "#f5fcff",
      },
      light: {
        background: "#185aff",
        foreground: "#f5fcff",
      },
    },
    subunits: 18,
    address: "0x0000000000085d4780B73119b644AE5ecd22b376",
  }),
  new TokenType({
    name: "Gemini Dollar",
    symbol: "GUSD",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3306.png",
    colors: {
      dark: {
        background: "#29dcf6",
        foreground: "#f2fcfb",
      },
      light: {
        background: "#29dcf6",
        foreground: "#f2fcfb",
      },
    },
    subunits: 2,
    address: "0x056Fd409E1d7A124BD7017459DFea2F387b6d5Cd",
  }),
];

export const ALL_TOKEN_TYPES = [
  PRIMARY_TOKEN_TYPE,
  ...SECONDARY_TOKEN_TYPES,
] as const;
