"use client";

import type {
  TokenSelectOption,
  TokenSelectProps,
} from "@/components/select/token-select";
import {
  PRIMARY_TOKEN_TYPE,
  SECONDARY_TOKEN_TYPES,
} from "@/constants/stablecoins";
import type { TokenType } from "@/lib/token";
import { useSession } from "next-auth/react";
import { useState } from "react";

export const useTokenTypes = () => {
  return {
    /**
     * Only pyusd for public users
     */
    public: PRIMARY_TOKEN_TYPE,
    /**
     * All tokens for authenticated users
     */
    private: SECONDARY_TOKEN_TYPES,
  };
};

export const usePrimaryTokenType = () => PRIMARY_TOKEN_TYPE;
export const useSecondaryTokenTypes = () => SECONDARY_TOKEN_TYPES;

export const useTokenSelectOptions = () => {
  const { status } = useSession();

  if (status === "loading") {
    return {
      status: "loading" as const,
    };
  }

  if (status === "unauthenticated") {
    const options: TokenSelectOption[] = [
      {
        tokenType: PRIMARY_TOKEN_TYPE,
        defaultSelected: true,
        disabled: false,
      },
      ...SECONDARY_TOKEN_TYPES.map((type) => ({
        tokenType: type,
        defaultSelected: false,
        disabled: true,
      })),
    ];

    return {
      status: "loaded" as const,
      options,
    };
  }

  // authenticated user
  const options: TokenSelectOption[] = [
    {
      tokenType: PRIMARY_TOKEN_TYPE,
      defaultSelected: true,
      disabled: false,
    },
    ...SECONDARY_TOKEN_TYPES.map((type) => ({
      tokenType: type,
      defaultSelected: false,
      disabled: false,
    })),
  ];

  return {
    status: "loaded" as const,
    options,
  };
};

export const useSelectedTokenTypes = () => {
  const DEFAULT_TOKEN_TYPE = usePrimaryTokenType();
  const selectables = useTokenSelectOptions();
  const [selected, setSelected] = useState([
    DEFAULT_TOKEN_TYPE,
  ] as TokenType<string>[]);

  const register: TokenSelectProps = {
    options: selectables.status === "loaded" ? selectables.options : [],
    onSelectionChange(selection) {
      // TODO: fix this
      console.log(selection);
    },
  };

  return [selected, register] as const;
};
