import { BigQuery, type BigQueryOptions } from "@google-cloud/bigquery";
import ethereumMainnet from "./goog_blockchain_ethereum_mainnet_us/index";
import { makeQueryHandler } from "./query-handler";

type BigQueryPluginOptions = {
  bigQueryOptions?: BigQueryOptions;
};

const createClient = (opts: BigQueryPluginOptions) => {
  const { bigQueryOptions } = opts;
  const bigQuery = new BigQuery(bigQueryOptions);
  const query = makeQueryHandler(bigQuery);

  // bigQuery
  //   .query(
  //     `
  //         SELECT address, data, topics
  //         FROM bigquery-public-data.goog_blockchain_ethereum_mainnet_us.logs
  //         WHERE LOWER(transaction_hash) = LOWER('0x8a42f6d4c407aacc053f84bff24d565b9177ff2cf9a04d775e9c5b4914133d58')
  //           AND block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 120 MINUTE)
  //         LIMIT 5;
  //   `,
  //   )
  //   .then(console.log)
  //   .catch(console.error);

  // ethereumMainnet(query)
  //   .getTransactions({
  //     address: app.ethereum.CONTRACT_ADDRESS,
  //     limit: 10,
  //     order: "DESC",
  //   })
  //   .then((result) => {

  //   });

  return {
    ethereum: {
      mainnet: ethereumMainnet(query),
      holesky: null,
    },
  } as const;
};

export default createClient;
