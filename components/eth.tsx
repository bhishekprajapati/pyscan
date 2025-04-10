import { formatEther, formatUnits } from "viem";

export const WeiToGwei = ({ wei = BigInt(0) }: { wei?: bigint }) =>
  `${formatUnits(wei, 9)} Gwei`;

export const WeiToEther = ({ wei = BigInt(0) }: { wei?: bigint }) =>
  `${formatEther(wei)} Eth`;
