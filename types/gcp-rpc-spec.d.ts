type GcpRpcSchema = [
  { Method: "eth_blockNumber"; Parameters: []; ReturnType: `0x${string}` },
  {
    Method: "eth_call";
    Parameters: [{ to: string; data?: string }, `0x${string}`];
    ReturnType: `0x${string}`;
  },
  { Method: "eth_chainId"; Parameters: []; ReturnType: `0x${string}` },
  {
    Method: "eth_estimateGas";
    Parameters: [{ to: string; data?: string }];
    ReturnType: `0x${string}`;
  },
  {
    Method: "eth_feeHistory";
    Parameters: [`0x${string}`, "latest", number[]];
    ReturnType: {
      oldestBlock: `0x${string}`;
      baseFeePerGas: `0x${string}`[];
      gasUsedRatio: number[];
    };
  },
  { Method: "eth_gasPrice"; Parameters: []; ReturnType: `0x${string}` },
  {
    Method: "eth_getBalance";
    Parameters: [string, `0x${string}` | "latest" | "pending"];
    ReturnType: `0x${string}`;
  },
  {
    Method: "eth_getBlockByHash";
    Parameters: [`0x${string}`, boolean];
    ReturnType: object | null;
  },
  {
    Method: "eth_getBlockByNumber";
    Parameters: [`0x${string}` | "latest" | "pending", boolean];
    ReturnType: object | null;
  },
  {
    Method: "eth_getBlockReceipts";
    Parameters: [`0x${string}`];
    ReturnType: object[];
  },
  {
    Method: "eth_getBlockTransactionCountByHash";
    Parameters: [`0x${string}`];
    ReturnType: `0x${string}`;
  },
  {
    Method: "eth_getBlockTransactionCountByNumber";
    Parameters: [`0x${string}` | "latest" | "pending"];
    ReturnType: `0x${string}`;
  },
  {
    Method: "eth_getCode";
    Parameters: [string, `0x${string}` | "latest" | "pending"];
    ReturnType: `0x${string}`;
  },
  {
    Method: "eth_getLogs";
    Parameters: [
      {
        address?: string | string[];
        topics?: (`0x${string}` | null)[];
        fromBlock?: `0x${string}`;
        toBlock?: `0x${string}`;
      },
    ];
    ReturnType: object[];
  },
  {
    Method: "eth_getTransactionByHash";
    Parameters: [`0x${string}`];
    ReturnType: object | null;
  },
  {
    Method: "eth_getTransactionReceipt";
    Parameters: [`0x${string}`];
    ReturnType: object | null;
  },
  {
    Method: "eth_getTransactionCount";
    Parameters: [string, `0x${string}` | "latest" | "pending"];
    ReturnType: `0x${string}`;
  },
  {
    Method: "eth_maxPriorityFeePerGas";
    Parameters: [];
    ReturnType: `0x${string}`;
  },
  {
    Method: "eth_subscribe";
    Parameters: [string, ...unknown[]];
    ReturnType: `0x${string}`;
  },
  {
    Method: "eth_unsubscribe";
    Parameters: [`0x${string}`];
    ReturnType: boolean;
  },
  {
    Method: "eth_sendRawTransaction";
    Parameters: [`0x${string}`];
    ReturnType: `0x${string}`;
  },
  { Method: "net_listening"; Parameters: []; ReturnType: boolean },
  { Method: "net_peerCount"; Parameters: []; ReturnType: `0x${string}` },
  { Method: "net_version"; Parameters: []; ReturnType: string },
  { Method: "txpool_inspect"; Parameters: []; ReturnType: object },
  { Method: "txpool_status"; Parameters: []; ReturnType: object },
  { Method: "web3_clientVersion"; Parameters: []; ReturnType: string },
  {
    Method: "web3_sha3";
    Parameters: [`0x${string}`];
    ReturnType: `0x${string}`;
  },
  { Method: "trace_block"; Parameters: [`0x${string}`]; ReturnType: object[] },
  {
    Method: "trace_transaction";
    Parameters: [`0x${string}`];
    ReturnType: object | null;
  },
  {
    Method: "debug_traceTransaction";
    Parameters: [`0x${string}`];
    ReturnType: object;
  },
];
