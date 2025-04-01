import type { BigQuery, Query } from "@google-cloud/bigquery";
import { data, error } from "./helper";

export function makeQueryHandler(bigQueryInstance: BigQuery) {
  return async function query(q: Query) {
    try {
      return data(await bigQueryInstance.query(q));
    } catch (err) {
      console.error(err);
      if (
        err !== null &&
        typeof err === "object" &&
        "code" in err &&
        typeof err.code === "number" &&
        "errors" in err &&
        "message" in err &&
        typeof err.message === "string"
      ) {
        const { code } = err;
        /**
         * Error Documentation:
         * @link https://cloud.google.com/bigquery/docs/error-messages
         */
        // Note: fallback intended
        switch (code) {
          case 400:
          case 403:
          case 404:
          case 409:
            return error({
              reason: err.message,
              retry: false,
              fatal: true,
            });

          case 500:
          case 503:
          case 504:
            return error({
              reason: err.message,
              retry: true,
              isInternal: false,
            });

          case 501:
            return error({
              reason: err.message,
              retry: false,
            });
        }
      }

      // TODO: handle auth errors
      // currently auth errors are marked as non fatal
      return error({
        reason: "Something went wrong",
        retry: true,
        isInternal: false,
      });
    }
  };
}

export type QueryHandler = ReturnType<typeof makeQueryHandler>;
