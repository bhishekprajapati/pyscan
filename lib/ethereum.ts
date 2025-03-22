import { CONTRACT_ADDRESS, IMPLEMENTATION_ABI } from "@/constants/pyusd";
import {
  createPublicClient,
  formatUnits,
  http,
  webSocket,
  type Abi,
  type WatchContractEventOnLogsFn,
  isAddress,
} from "viem";
import { mainnet } from "viem/chains";

type UnsubscribeFn = () => void;

export type EthereumPluginOptions = {
  ETHEREUM_MAINNET_JSON_RPC_URL: string;
  ETHEREUM_MAINNET_WSS_URL: string;
  ETHEREUM_HOLESKY_JSON_RPC_URL: string;
  ETHEREUM_HOLESKY_WSS_URL: string;
};

const createEthereumClients = (opts: EthereumPluginOptions) => {
  const abi = IMPLEMENTATION_ABI;

  const mainnetHttpClient = createPublicClient({
    chain: mainnet,
    transport: http(opts.ETHEREUM_MAINNET_JSON_RPC_URL),
  });

  const mainnetWsClient = createPublicClient({
    chain: mainnet,
    transport: webSocket(opts.ETHEREUM_MAINNET_WSS_URL),
  });

  function watchEvent(
    onLogs: WatchContractEventOnLogsFn<
      Abi | readonly unknown[],
      string,
      undefined
    >,
  ): UnsubscribeFn {
    return mainnetWsClient.watchContractEvent({
      abi,
      address: CONTRACT_ADDRESS,
      onLogs,
    });
  }

  const createContractMethods = () => {
    const client = mainnetHttpClient;
    const read = client.readContract.bind(client);
    const baseArgs = {
      address: CONTRACT_ADDRESS,
      abi,
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

    return {
      getName,
      getSymbol,
      getDecimals,
      getTotalSupply,
    };
  };

  return {
    CONTRACT_ADDRESS,
    mainnet: {
      httpClient: mainnetHttpClient,
      wsClient: mainnetWsClient,
      watchEvent,
      ...createContractMethods(),
    } as const,
    isAddress,
  } as const;
};
