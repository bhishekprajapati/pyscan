import { formatUnits } from "viem";

export const microToPyusd = (quantity: string) =>
  Number(quantity) / Math.pow(10, 6);

export const weiToEth = (wei: bigint) => formatUnits(wei, 18);
