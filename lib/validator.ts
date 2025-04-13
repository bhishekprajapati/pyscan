import {
  PRIMARY_TOKEN_TYPE,
  SECONDARY_TOKEN_TYPES,
} from "@/constants/stablecoins";
import { z } from "zod";

export const isPrimaryTokenAddress = (address: string) =>
  PRIMARY_TOKEN_TYPE.getContractAddress().toLowerCase() ===
  address.toLowerCase();

export const isSecondaryTokenAddress = (address: string) =>
  SECONDARY_TOKEN_TYPES.some(
    (tk) => tk.getContractAddress().toLowerCase() === address.toLowerCase(),
  );

export const primaryTokenAddressSchema = z
  .string()
  .trim()
  .min(1)
  .refine((address) => isPrimaryTokenAddress(address), {
    message: "Unsupported token address",
  });

export const primaryOrSecondaryTokenAddressSchema = z
  .string()
  .trim()
  .min(1)
  .refine(
    (address) =>
      isPrimaryTokenAddress(address) || isSecondaryTokenAddress(address),
    {
      message: "Unsupported token address",
    },
  );
