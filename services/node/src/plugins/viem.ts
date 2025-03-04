import fp from "fastify-plugin";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createPublicClient,
  http,
  webSocket,
  type Abi,
  type Address,
  type WatchContractEventOnLogsFn,
} from "viem";
import { mainnet } from "viem/chains";

type UnsubscribeFn = () => void;

const createEthereumClients = (opts: ViemPluginOptions) => {
  // const getTransactions = async () => {
  //   // const latestBlock = await httpClient.request({
  //   //   method: "eth_blockNumber",
  //   // });
  //   // const fromBlock = BigInt(latestBlock) - BigInt(4); // Exactly 5 blocks range
  //   // const toBlock = BigInt(latestBlock);
  //   // const logs = await httpClient.getLogs({
  //   //   address: "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8",
  //   //   fromBlock: "pending",
  //   //   toBlock: "pending",
  //   //   // fromBlock,
  //   //   // toBlock,
  //   // });
  //   // return logs;
  // };
  // .watchContractEvent({
  //   abi,
  //   address: "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8",
  //   onLogs(logs) {
  //     console.log(logs);
  //   },
  // });

  const mainnetHttpClient = createPublicClient({
    chain: mainnet,
    transport: http(opts.ETHEREUM_MAINNET_JSON_RPC_URL),
  });

  const mainnetWsClient = createPublicClient({
    chain: mainnet,
    transport: webSocket(opts.ETHEREUM_MAINNET_WSS_URL),
  });

  function getLogs() {
    return mainnetHttpClient.getLogs({
      address: opts.CONTRACT_ADDRESS,
      fromBlock: "latest",
      toBlock: "latest",
    });
  }

  function watchEvent(
    onLogs: WatchContractEventOnLogsFn<
      Abi | readonly unknown[],
      string,
      undefined
    >,
  ): UnsubscribeFn {
    return mainnetWsClient.watchContractEvent({
      abi: opts.CONTRACT_ABI,
      address: opts.CONTRACT_ADDRESS,
      onLogs,
    });
  }

  return {
    mainnet: {
      httpClient: mainnetHttpClient,
      wsClient: mainnetWsClient,
      getLogs,
      watchEvent,
    } as const,
  } as const;
};

export type ViemPluginOptions = {
  ETHEREUM_MAINNET_JSON_RPC_URL: string;
  ETHEREUM_MAINNET_WSS_URL: string;
  ETHEREUM_HOLESKY_JSON_RPC_URL: string;
  ETHEREUM_HOLESKY_WSS_URL: string;
  CONTRACT_ADDRESS: Address | Address[] | undefined;
  CONTRACT_ABI: Abi | readonly unknown[];
};

const plugin = fp<ViemPluginOptions>(
  (fastify, opts, done) => {
    const app = fastify.withTypeProvider<ZodTypeProvider>();
    app.log.info(`Registering ${app.pluginName}...`);
    const clients = createEthereumClients(opts);
    app.decorate("viem", clients);
    app.log.info(`${app.pluginName} registration completed!`);
    done();
  },
  {
    name: "plugin:viem",
    fastify: "5.x",
  },
);

export default plugin;

declare module "fastify" {
  interface FastifyInstance {
    viem: ReturnType<typeof createEthereumClients>;
  }
}
