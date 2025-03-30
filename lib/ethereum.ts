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

  const client = createPublicClient({
    chain: mainnet,
    transport: http(opts.ETHEREUM_MAINNET_JSON_RPC_URL),
  });

  const createContractMethods = () => {
    const read = client.readContract.bind(client);

    const baseArgs = {
      abi,
      address: CONTRACT_ADDRESS,
    } as const;

    const getSymbol = () =>
      read({
        ...baseArgs,
        functionName: "symbol",
      });

    const getDecimals = () =>
      read({
        ...baseArgs,
        functionName: "decimals",
      });

    const getName = () =>
      read({
        ...baseArgs,
        functionName: "name",
      });

    const getTotalSupply = async () => {
      const total = await read({
        ...baseArgs,
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
      getName,
      getSymbol,
      getDecimals,
      getTotalSupply,
      getLogs,
    };
  };

  return {
    CONTRACT_ADDRESS,
    mainnet: {
      httpClient: client,
      ...createContractMethods(),
    } as const,
    isAddress,
  } as const;
};

export default createClient({ ...env });
