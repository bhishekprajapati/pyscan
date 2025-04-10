import { formatUnits } from "viem";

export const WeiToGwei = ({ wei = BigInt(0) }: { wei?: bigint }) =>
  `${formatUnits(wei, 9)} Gwei`;
