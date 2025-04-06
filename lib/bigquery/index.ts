import { BigQuery, type BigQueryOptions } from "@google-cloud/bigquery";
import ethereumMainnet from "./goog_blockchain_ethereum_mainnet_us/index";
import { makeQueryHandler } from "./query-handler";

interface BigQueryErrorDetail {
  message: string;
  domain: string;
  reason?: string;
  location?: string;
  locationType?: "parameter";
}

interface BigQueryError {
  errors: BigQueryErrorDetail[];
  code: number;
}

export function isBigQueryError(error: unknown): error is BigQueryError {
  return (
    error !== null &&
    typeof error === "object" &&
    "errors" in error &&
    Array.isArray(error.errors) &&
    error.errors.every((err) => typeof err.message === "string")
  );
}

type BigQueryPluginOptions = {
  bigQueryOptions?: BigQueryOptions;
};

const createClient = (opts: BigQueryPluginOptions = {}) => {
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

export default createClient();
