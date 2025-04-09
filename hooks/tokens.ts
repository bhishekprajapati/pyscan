"use client";

import type {
  TokenSelectOption,
  TokenSelectProps,
} from "@/components/select/token-select";
import stablecoins from "@/constants/stablecoins";
import { useSession } from "next-auth/react";
import { useState } from "react";

export const useTokens = () => {
  return {
    /**
     * Only pyusd for public users
     */
    public: stablecoins.filter(({ primary }) => primary),
    /**
     * All tokens for authenticated users
     */
    private: stablecoins,
    getTokenColor: (symbol: string, fallback = "blue") => {
      return (
        stablecoins.find((tk) => tk.symbol === symbol)?.color.background ??
        fallback
      );
    },
  };
};

// TODO: change this hard and think of a more intutive and robust structure
export const usePrimaryToken = () => stablecoins[4];

export const useTokenSelectOptions = (): TokenSelectOption[] => {
  const tokens = useTokens();
  const session = useSession();
  return session.status === "authenticated"
    ? tokens.private.map(({ contractAddress, logo, symbol, primary }) => ({
        logo,
        address: contractAddress,
        label: symbol,
        defaultSelected: primary,
        disabled: false,
      }))
    : tokens.private.map(({ contractAddress, logo, symbol, primary }) => ({
        logo,
        address: contractAddress,
        label: symbol,
        defaultSelected: primary,
        disabled: primary ? false : true,
      }));
};

export const useSelectedTokens = () => {
  const options = useTokenSelectOptions();
  const [selected, setSelected] = useState<TokenSelectOption[]>(
    options.filter(({ defaultSelected }) => defaultSelected),
  );
  const register: TokenSelectProps = {
    options,
    onSelectionChange(keys) {
      const set = new Set(keys);
      setSelected(options.filter(({ address }) => set.has(address)));
    },
  };
  return [selected, register] as const;
};
