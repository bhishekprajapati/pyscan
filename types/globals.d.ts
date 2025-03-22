type HexString = `0x${string}`;

type Transaction = {
  address: HexString;
  topics: [HexString, HexString, HexString];
  data: HexString;
  blockNumber: BigInt;
  transactionHash: HexString;
  transactionIndex: number;
  blockHash: HexString;
  logIndex: number;
  removed: boolean;
};
