"use client";

import type { TimeframeSelectProps } from "@/components/select/timeframe-select";
import type {
  PrivateTimeframe,
  PublicTimeframe,
} from "@/lib/bigquery/goog_blockchain_ethereum_mainnet_us/schema";
import { useSession } from "next-auth/react";
import { useState } from "react";

const DEFAULT_SELECTED_PUBLIC_TIMEFRAME: PublicTimeframe = "1h";
const DEFAULT_SELECTED_PRIVATE_TIMEFRAME: PrivateTimeframe = "1h";

const MAX_LIMITS = {
  "1h": 30,
  "1d": 30,
  "1w": 4,
  "1M": 1,
} as const;

type Timeframe = keyof typeof MAX_LIMITS;

export const useTimeframes = () => {
  const pub: { key: PublicTimeframe; label: string }[] = [
    {
      key: "1h",
      label: "1 Hour",
    },
  ];

  const pri: { key: PrivateTimeframe; label: string }[] = [
    {
      key: "1h",
      label: "1 Hour",
    },
    {
      key: "1d",
      label: "1 Day",
    },
    {
      key: "1w",
      label: "1 Week",
    },
    {
      key: "1M",
      label: "1 Month",
    },
  ];

  return {
    /** Timeframes for public users */
    public: pub,
    /** Timeframes for private users */
    private: pri,
  } as const;
};

// Dropping this idea
// I wanted to support multiple timeframes
// but only few are allowed for anonymous users
// and full access for authenticated user
// It does not matter now since I'm caching bigquery
// calls aggresively on server anyway so this doesn't make sense
// and also I'm running out of time
// but this code stays here for no reason
// until i do something about it in future

export const useTimeframeSelectOptions = () => {
  const timeframes = useTimeframes();
  const session = useSession();
  const options: TimeframeSelectProps["options"] = timeframes.private.map(
    ({ key, label }) => ({
      key,
      label,
      defaultSelected: key === "1h",
      disabled: false,
    }),
  );

  return {
    options,
    defaultTimeframe:
      session.status === "authenticated"
        ? DEFAULT_SELECTED_PRIVATE_TIMEFRAME
        : DEFAULT_SELECTED_PUBLIC_TIMEFRAME,
  };
};

/**
 *
 * @returns [selectedOptions, registerProps]
 */
export const useSelectedTimeframe = (defaultTF?: Timeframe) => {
  const { options, defaultTimeframe } = useTimeframeSelectOptions();
  const [selected, setSelected] = useState<Timeframe>(
    defaultTF ?? defaultTimeframe,
  );

  const register: Pick<TimeframeSelectProps, "options" | "onSelectionChange"> =
    {
      options,

      onSelectionChange: (set) => {
        setSelected(Array.from(set)[0] as Timeframe);
      },
    };

  return [selected, register] as const;
};

export const useTimeframeMaxLimit = (tf: keyof typeof MAX_LIMITS) =>
  MAX_LIMITS[tf];
