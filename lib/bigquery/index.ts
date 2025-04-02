import { BigQuery, type BigQueryOptions } from "@google-cloud/bigquery";
import ethereumMainnet from "./goog_blockchain_ethereum_mainnet_us/index";
import { makeQueryHandler } from "./query-handler";

type BigQueryPluginOptions = {
  bigQueryOptions?: BigQueryOptions;
};

const createClient = (opts: BigQueryPluginOptions = {}) => {
  const { bigQueryOptions } = opts;
  const bigQuery = new BigQuery(bigQueryOptions);
  const query = makeQueryHandler(bigQuery);

  return {
    ethereum: {
      mainnet: ethereumMainnet(query),
      holesky: null,
    },
  } as const;
};

export default createClient();
