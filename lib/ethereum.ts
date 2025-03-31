import { CONTRACT_ADDRESS, IMPLEMENTATION_ABI } from "@/constants/pyusd";
import env from "@/env";
import { createPublicClient, formatUnits, http, isAddress } from "viem";
import { mainnet } from "viem/chains";

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

    return {
      httpClient: client,
      getName,
      getSymbol,
      getDecimals,
      getTotalSupply,
      getLogs,
      getBlockInfo,
    } as const;
  };

  return {
    CONTRACT_ADDRESS,
    mainnet: createMainnetMethods(),
  } as const;
};

export default createClient({ ...env });
export { isAddress };
