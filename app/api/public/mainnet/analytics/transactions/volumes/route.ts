import { api } from "@/lib/api.helpers";
import bigquery from "@/lib/bigquery";
import { timeseriesFilters } from "@/lib/bigquery/goog_blockchain_ethereum_mainnet_us/schema";
import { z } from "zod";

const { timeseries } = bigquery.ethereum.mainnet.analytics;

const querySchema = z.object({
  type: z.enum(["all", "transfers"]),
  filter: timeseriesFilters.public,
});

export const GET = api(async (req, { data, error }) => {
  const validation = querySchema.safeParse(req.nextUrl.searchParams);

  if (!validation.success) {
    return error(
      {
        name: "validation_error",
      },
      {
        status: 400,
      },
    );
  }

  const query = validation.data;

  if (query.type === "all") {
    const result = await timeseries.getTxnCount(query.filter);
    if (!result.success) {
      return error({
        name: "internal_server_error",
      });
    }

    return data(result.data);
  }

  // const result = await timeseries
});
