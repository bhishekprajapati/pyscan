import {
  CONTRACT_ADDRESS,
  IMPLEMENTATION_ABI,
  TRANSFER_EVENT,
} from "@/constants/pyusd";
import env from "@/env";
import { pick } from "remeda";
import {
  Address,
  createPublicClient,
  formatUnits,
  Hash,
  http,
  webSocket,
  InvalidParamsRpcError,
  isAddress,
} from "viem";
import { mainnet } from "viem/chains";
import { BoundedStack } from "@/lib/stack";

const data = <T>(data: T) => ({
  success: true as const,
  data,
});

type ClientError<T extends string> = {
  name: T;
  message?: string;
  isInternal?: boolean;
};

const error = <T extends string>(err: ClientError<T>) => ({
  success: false as const,
  err: {
    name: err.name,
    message: err.message === undefined ? "Failed to fetch data" : err.message,
    isInternal: err.isInternal ?? true,
  },
});

export type CreateClientOption = {
  ETHEREUM_MAINNET_JSON_RPC_URL: string;
  ETHEREUM_MAINNET_WSS_URL: string;
  ETHEREUM_HOLESKY_JSON_RPC_URL: string;
  ETHEREUM_HOLESKY_WSS_URL: string;
};

export const createClient = (opts: CreateClientOption) => {
  const abi = IMPLEMENTATION_ABI;

  const createMainnetMethods = () => {
    type TokenTransferData = {
      address: string;
      record: {
        block_number: number;
        block_timestamp: string;
        transaction_hash: string;
        event_hash: string;
        from_address: string;
        to_address: string;
        quantity: string;
        event_index: number;
      };
    };

    const liveTokenTransferStack = new BoundedStack<TokenTransferData>(25);

    const client = createPublicClient({
      chain: mainnet,
      transport: http(opts.ETHEREUM_MAINNET_JSON_RPC_URL),
    });

    const ws = createPublicClient({
      chain: mainnet,
      transport: webSocket(opts.ETHEREUM_MAINNET_WSS_URL),
    });

    const getBlockInfo = async (num: bigint) => {
      try {
        const block = await client.getBlock({
          blockNumber: num,
        });
        return data(block);
      } catch {
        return error({
          name: "unknown",
          message: "failed to fetch",
          isInternal: false,
        });
      }
    };

    const getIsBlockFinalized = async (blockNumber: bigint) => {
      try {
        const latest = await client.getBlock({
          blockTag: "finalized",
        });
        return data(blockNumber <= latest.number);
      } catch {
        return error({
          name: "unknown",
          message: "failed to fetch",
          isInternal: false,
        });
      }
    };

    const getSymbol = () =>
      client.readContract({
        abi,
        address: CONTRACT_ADDRESS,
        functionName: "symbol",
      });

    const getDecimals = () =>
      client.readContract({
        abi,
        address: CONTRACT_ADDRESS,
        functionName: "decimals",
      });

    const getName = () =>
      client.readContract({
        abi,
        address: CONTRACT_ADDRESS,
        functionName: "name",
      });

    const getTotalSupply = async () => {
      const total = await client.readContract({
        abi,
        address: CONTRACT_ADDRESS,
        functionName: "totalSupply",
      });

      return formatUnits(total, await getDecimals());
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getLogs = async (from: "latest" | bigint = "latest", count = 5) => {
      const latestBlock = await client.getBlockNumber();
      const startBlock = latestBlock - BigInt(5);

      const logs = await client.getLogs({
        address: CONTRACT_ADDRESS,
        fromBlock: startBlock,
        toBlock: latestBlock,
      });

      return logs;
    };

    const getTransaction = async (hash: Hash) => {
      try {
        const tx = await client.getTransaction({
          hash,
        });

        const receipt = await client.getTransactionReceipt({
          hash: tx.hash,
        });

        const confirmation = await client.getTransactionConfirmations({
          hash: tx.hash,
        });

        const block = await client.getBlock({ blockNumber: tx.blockNumber });

        return data({
          confirmation,
          ...tx,
          ...pick(block, ["timestamp"]),
          ...pick(receipt, ["status", "logs", "logsBloom"]),
        });
      } catch (err) {
        if (err instanceof InvalidParamsRpcError) {
          return error({
            name: "ValidationError",
            message: "Invalid transaction hash provided",
            isInternal: false,
          });
        }

        return error({
          name: "ServerError",
          message: "Something Went wrong",
          isInternal: false,
        });
      }
    };

    const getEnsInfo = async (address: Address) => {
      try {
        const name = await client.getEnsName({
          address,
        });
        if (name === null) return data(null);
        const [avatar, resolvedAddress] = await Promise.all([
          client.getEnsAvatar({ name }),
          client.getEnsAddress({ name }),
        ]);
        return data({ name, avatar, resolvedAddress });
      } catch {
        return error({
          name: "unknown",
          isInternal: false,
          message: "failed to fetch",
        });
      }
    };

    const getLatestBlocks = async () => {
      const LIMIT = 10; // No. of block to fetch
      try {
        const latest = await client.getBlockNumber();
        // step 1: fetch last LIMIT + 1 Blocks
        const blocks = await Promise.all(
          Array.from({ length: LIMIT + 1 }, (_, i) =>
            client.getBlock({ blockNumber: latest - BigInt(i + 1) }),
          ),
        );

        // Step 2: calculate block generation time
        const slice = blocks.slice(0, LIMIT).map((block, idx) => ({
          ...block,
          duration: block.timestamp - blocks[idx + 1].timestamp,
        }));

        // step 3: get ens name for sliced blocks
        const slicedBlocks = await Promise.all(
          slice.map((bk) =>
            client
              .getEnsName({ address: bk.miner })
              .then((name) => ({ ...bk, ensName: name })),
          ),
        );

        // step 4: transform block data
        const transformed = slicedBlocks.map((bk) => ({
          transactionCount: bk.transactions.length,
          ...pick(bk, ["number", "timestamp", "duration", "miner", "ensName"]),
        }));
        return data(transformed);
      } catch {
        return error({
          name: "unknown",
          message: "Failed to fetch",
          isInternal: false,
        });
      }
    };

    const getLatestTransactions = async () => {
      try {
        const block = await client.getBlock({
          blockTag: "latest",
          includeTransactions: true,
        });
        const txns = block.transactions.slice(0, 10);
        return data({ txns, timestamp: block.timestamp });
      } catch {
        return error({
          name: "unknown",
          message: "Failed to fetch",
          isInternal: false,
        });
      }
    };

    const getBlockTransactions = async (number: string) => {
      try {
        const block = await client.getBlock({
          blockNumber: BigInt(number),
          includeTransactions: true,
        });
        return data(
          block.transactions.map((tx) => ({
            timestamp: block.timestamp,
            ...pick(tx, ["hash", "from", "to", "value", "blockNumber"]),
          })),
        );
      } catch {
        return error({
          name: "unknown",
          message: "Failed to fetch",
          isInternal: false,
        });
      }
    };

    const getGasPrice = async () => {
      try {
        return data(await client.getGasPrice());
      } catch {
        return error({
          name: "unknown",
          message: "Failed to fetch",
          isInternal: false,
        });
      }
    };

    if (typeof process !== "undefined") {
      const unwatch = ws.watchEvent({
        address: CONTRACT_ADDRESS,
        event: TRANSFER_EVENT,
        onLogs: async (logs) => {
          const logsWithBlock = (
            await Promise.allSettled(
              logs.map(async (log) => {
                const result = await getBlockInfo(log.blockNumber);
                if (!result.success) {
                  throw Error(result.err.message);
                }
                return {
                  log,
                  block: result.data,
                };
              }),
            )
          )
            .filter((p) => p.status === "fulfilled")
            .map((p) => p.value);

          // WARN: type mismatch
          // @ts-expect-error fix this later
          const transfers: TokenTransferData[] = logsWithBlock.map(
            ({ log, block }) => ({
              address: log.address,
              record: {
                block_number: Number(log.blockNumber.toString()),
                block_timestamp: new Date(
                  Number(block.timestamp) * 1000,
                ).toISOString(),
                from_address: log.args.from,
                to_address: log.args.to,
                quantity: log.args.value?.toString(),
                transaction_hash: log.transactionHash,
                event_index: log.logIndex,
                event_hash: log.transactionHash,
              },
            }),
          );

          liveTokenTransferStack.push(transfers);
        },
      });
      process.on("SIGINT", unwatch);
      process.on("SIGTERM", unwatch);
    }

    const getBalance = async (address: string) => {
      try {
        const balance = await client.readContract({
          address: CONTRACT_ADDRESS,
          abi,
          functionName: "balanceOf",
          args: [address as Address],
        });
        return data(balance);
      } catch {
        return error({
          name: "unknown",
        });
      }
    };

    return {
      httpClient: client,
      getBalance,
      getName,
      getSymbol,
      getDecimals,
      getTotalSupply,
      getLogs,
      getBlockInfo,
      getTransaction,
      // getAddressInfo,
      getEnsInfo,
      getIsBlockFinalized,
      getLatestBlocks,
      getLatestTransactions,
      getBlockTransactions,
      getGasPrice,
      liveTokenTransferStack,
    } as const;
  };

  return {
    CONTRACT_ADDRESS,
    mainnet: createMainnetMethods(),
  } as const;
};

export default createClient({ ...env });
export { isAddress };
