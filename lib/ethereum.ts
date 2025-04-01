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
      const [block, finalizedBlock] = await Promise.all([
        client.getBlock({
          blockNumber: num,
        }),
        client.getBlock({
          blockTag: "finalized",
        }),
      ]);

      return {
        ...block,
        isFinalized: block.number <= finalizedBlock.number,
      };
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

    return {
      httpClient: client,
      getName,
      getSymbol,
      getDecimals,
      getTotalSupply,
      getLogs,
      getBlockInfo,
      getTransaction,
    } as const;
  };

  return {
    CONTRACT_ADDRESS,
    mainnet: createMainnetMethods(),
  } as const;
};

export default createClient({ ...env });
export { isAddress };
