import { BigQuery, type BigQueryOptions } from "@google-cloud/bigquery";
import ethereumMainnet from "./goog_blockchain_ethereum_mainnet_us/index";
import { makeQueryHandler } from "./query-handler";
import env from "@/env";

type BigQueryPluginOptions = {
  bigQueryOptions?: BigQueryOptions;
};

export const createClient = (opts: BigQueryPluginOptions = {}) => {
  const { bigQueryOptions } = opts;
  const bigQuery = new BigQuery(bigQueryOptions);
  const handler = makeQueryHandler(bigQuery);

  const dryrun = async (query: string) =>
    await bigQuery.createQueryJob({
      query,
      useLegacySql: false,
      dryRun: false,
    });

  const execute = async (jobId: string) => {
    try {
      const res = await bigQuery.job(jobId).get({
        autoCreate: false,
      });
      return res;
    } catch (err) {
      return err;
    }
  };

  return {
    ethereum: {
      mainnet: ethereumMainnet(handler),
      holesky: null,
    },
    client: bigQuery,
    query: {
      dryrun,
      execute,
    },
  } as const;
};

const creds = JSON.parse(
  Buffer.from(env.GOOGLE_CREDS_BASE64_1, "base64").toString(),
);

export default createClient({
  bigQueryOptions: {
    credentials: creds,
    projectId: creds["projectId"],
  },
});
