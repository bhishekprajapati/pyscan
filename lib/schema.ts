import { z } from "zod";

export const MAX_SQL_QUERY_LENGTH = 1024;
export const sqlQuerySchema = z
  .string()
  .trim()
  .min(1, {
    message: "Empty query provided",
  })
  .max(MAX_SQL_QUERY_LENGTH, {
    message: "Longer queries are not supported",
  });
