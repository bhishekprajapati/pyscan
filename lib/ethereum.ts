import { CONTRACT_ADDRESS, IMPLEMENTATION_ABI } from "@/constants/pyusd";
import env from "@/env";
import { pick } from "remeda";
import {
  createPublicClient,
  formatUnits,
  http,
  isAddress,
  Hash,
  InvalidParamsRpcError,
  Address,
} from "viem";
import { mainnet } from "viem/chains";

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
    const client = createPublicClient({
      chain: mainnet,
      transport: http(opts.ETHEREUM_MAINNET_JSON_RPC_URL),
    });

    const getBlockInfo = async (num: bigint) => {
      try {
        const block = await client.getBlock({
          blockNumber: num,
        });
        return data(block);
      } catch (err) {
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
      } catch (err) {
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

    const getAddressInfo = async (address: Address) => {};

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
      } catch (err) {
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
      } catch (err) {
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
      } catch (err) {
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
      } catch (err) {
        return error({
          name: "unknown",
          message: "Failed to fetch",
          isInternal: false,
        });
      }
    };

    return {
      httpClient: client,
      getName,
      getSymbol,
      getDecimals,
      getTotalSupply,
      getLogs,
      getBlockInfo,
      getTransaction,
      getAddressInfo,
      getEnsInfo,
      getIsBlockFinalized,
      getLatestBlocks,
      getLatestTransactions,
      getBlockTransactions,
    } as const;
  };

  return {
    CONTRACT_ADDRESS,
    mainnet: createMainnetMethods(),
  } as const;
};

export default createClient({ ...env });
export { isAddress };
