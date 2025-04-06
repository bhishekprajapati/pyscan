import { z } from "zod";

import { auth, InferApiResponse } from "@/lib/api.helpers";
import bigquery, { isBigQueryError } from "@/lib/bigquery";
import { sqlQuerySchema } from "@/lib/schema";

const bodySchema = z.object({
  query: sqlQuerySchema,
});

export type ExecuteQueryApiResponse = InferApiResponse<typeof POST>;
export const POST = auth(async (req, res) => {
  const json = await req.json();
  const validation = bodySchema.safeParse(json);
  if (!validation.success) {
    return res.error(
      {
        name: "validation_error",
        message: validation.error
          .flatten()
          .fieldErrors.query?.map((m) => m)
          .join(", "),
      },
      {
        status: 400,
      },
    );
  }

  const { data: body } = validation;
  const { query } = body;

  try {
    const [result] = await bigquery.client.createQueryJob({
      query,
      dryRun: true,
    });
    return res.data(result);
  } catch (err) {
    if (isBigQueryError(err) && err.code === 400) {
      return res.error(
        {
          name: "validation_error",
          message: err.errors[0].message,
        },
        {
          status: 400,
        },
      );
    }
    throw err;
  }
});
