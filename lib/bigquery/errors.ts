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
