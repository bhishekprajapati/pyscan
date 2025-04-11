import {
  PRIMARY_TOKEN_TYPE,
  SECONDARY_TOKEN_TYPES,
} from "@/constants/stablecoins";

export const isPrimaryTokenAddress = (address: string) =>
  PRIMARY_TOKEN_TYPE.getContractAddress().toLowerCase() ===
  address.toLowerCase();

export const isSecondaryTokenAddress = (address: string) =>
  SECONDARY_TOKEN_TYPES.some(
    (tk) => tk.getContractAddress().toLowerCase() === address.toLowerCase(),
  );
