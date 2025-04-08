import { isAddress } from "viem";
import { z } from "zod";

export const order = z.enum(["ASC", "DESC"]);
export const address = z
  .string()
  .trim()
  .refine((s) => isAddress(s), {
    message: "Invalid address",
  });

export const timeseriesFilters = (() => {
  const limit = z.number().gt(0).int();

  const $5m = z.object({
    timeframe: z.literal("5m"),
    limit: limit.max(100).default(25),
  });

  const $15m = z.object({
    timeframe: z.literal("15m"),
    limit: limit.max(100).default(25),
  });

  const $30m = z.object({
    timeframe: z.literal("30m"),
    limit: limit.max(100).default(25),
  });

  const $1h = z.object({
    timeframe: z.literal("1h"),
    limit: limit.max(100).default(10),
  });

  const $3h = z.object({
    timeframe: z.literal("3h"),
    limit: limit.max(100).default(10),
  });

  const $6h = z.object({
    timeframe: z.literal("6h"),
    limit: limit.max(100).default(10),
  });

  const $12h = z.object({
    timeframe: z.literal("12h"),
    limit: limit.max(60).default(10),
  });

  const $1d = z.object({
    timeframe: z.literal("1d"),
    limit: limit.max(30).default(10),
  });

  const $1w = z.object({
    timeframe: z.literal("1w"),
    limit: limit.max(4).default(4),
  });

  const $1M = z.object({
    timeframe: z.literal("1M"),
    limit: limit.max(1).default(1),
  });

  const ms = {
    "5m": 5 * 60 * 1000,
    "15m": 15 * 60 * 1000,
    "30m": 30 * 60 * 1000,
    "1h": 60 * 60 * 1000,
    "3h": 3 * 60 * 60 * 1000,
    "6h": 6 * 60 * 60 * 1000,
    "12h": 12 * 60 * 60 * 1000,
    "1d": 24 * 60 * 60 * 1000,
    "1w": 7 * 24 * 60 * 60 * 1000,
    "1M": 30 * 24 * 60 * 60 * 1000,
  } as const;

  const tfToMs = (tf: keyof typeof ms) => ms[tf];
  const tfToUnit = (tf: keyof typeof ms) => {
    switch (tf) {
      case "1h":
        return "HOUR";
      case "1d":
        return "DAY";
      case "1w":
        return "WEEK";
      case "1M":
        return "MONTH";
      default:
        return "HOUR";
    }
  };

  const parsetimeframe = (tf: keyof typeof ms, limit: number) => {
    const now = new Date();
    const duration = tfToMs(tf) * limit;
    const end = now.toISOString();
    const start = new Date(now.getTime() - duration).toISOString();
    const unit = tfToUnit(tf);
    return [start, end, unit] as const;
  };

  return {
    $5m,
    $15m,
    $30m,
    $1h,
    $3h,
    $6h,
    $12h,
    $1d,
    $1w,
    $1M,
    /**
     * For public endpoints
     */
    public: z.discriminatedUnion("timeframe", [$1d, $1w]),
    /**
     * For private endpoints
     */
    private: z.discriminatedUnion("timeframe", [
      $5m,
      $15m,
      $30m,
      $1h,
      $3h,
      $6h,
      $12h,
      $1d,
      $1w,
      $1M,
    ]),
    parsetimeframe,
  };
})();
