import { formatUnits } from "viem";

export const weiToEth = (wei: bigint) => formatUnits(wei, 18);
