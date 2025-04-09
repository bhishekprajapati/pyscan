"use client";

import type {
  TimeframeOption,
  TimeframeSelectProps,
} from "@/components/select/timeframe-select";
import type {
  PrivateTimeframe,
  PublicTimeframe,
} from "@/lib/bigquery/goog_blockchain_ethereum_mainnet_us/schema";
import { useSession } from "next-auth/react";
import { useState } from "react";

const DEFAULT_SELECTED_PUBLIC_TIMEFRAME: PublicTimeframe = "1d";
const DEFAULT_SELECTED_PRIVATE_TIMEFRAME: PrivateTimeframe = "6h";

type Timeframe = PublicTimeframe | PrivateTimeframe;

const MAX_LIMITS = {
  "5m": 25,
  "15m": 25,
  "30m": 25,
  "1h": 25,
  "3h": 10,
  "6h": 10,
  "12h": 10,
  "1d": 10,
  "1w": 4,
  "1M": 1,
} as const;

export const useTimeframes = () => {
  const pub: { key: PublicTimeframe; label: string }[] = [
    {
      key: "1d",
      label: "1 Day",
    },
    {
      key: "1w",
      label: "1 Week",
    },
  ];

  const pri: { key: PrivateTimeframe; label: string }[] = [
    // TODO: backend bigquery queries needs fizing inorder to make these timeframe work
    // {
    //   key: "5m",
    //   label: "5 Min",
    // },
    // {
    //   key: "15m",
    //   label: "15 Min",
    // },
    // {
    //   key: "30m",
    //   label: "30 Min",
    // },
    {
      key: "1h",
      label: "1 Hour",
    },
    {
      key: "3h",
      label: "3 Hours",
    },
    {
      key: "6h",
      label: "6 Hours",
    },
    {
      key: "12h",
      label: "12 Hours",
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

export const useTimeframeSelectOptions = () => {
  const timeframes = useTimeframes();
  const session = useSession();
  const options =
    session.status === "authenticated"
      ? timeframes.private.map(({ key, label }) => ({
          key,
          label,
          defaultSelected: key === DEFAULT_SELECTED_PRIVATE_TIMEFRAME,
          disabled: false,
        }))
      : timeframes.private.map(({ key, label }) => ({
          key,
          label,
          defaultSelected: key === DEFAULT_SELECTED_PUBLIC_TIMEFRAME,
          disabled: key === "1d" || key === "1w" ? false : true,
        }));

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
export const useSelectedTimeframe = () => {
  const { options, defaultTimeframe } = useTimeframeSelectOptions();
  const [selected, setSelected] = useState<Timeframe>(defaultTimeframe);

  const register: Pick<TimeframeSelectProps, "options" | "onSelectionChange"> =
    {
      options,
      onSelectionChange: ({ currentKey }) => {
        setSelected(currentKey as Timeframe);
      },
    };

  return [selected, register] as const;
};

export const useTimeframeMaxLimit = (tf: keyof typeof MAX_LIMITS) =>
  MAX_LIMITS[tf];
