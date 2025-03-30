type ApiResponse<TData extends unknown, TError extends string = "unknown"> =
  | {
      ok: true;
      data: TData;
    }
  | {
      ok: false;
      error: {
        name: TError;
        message: string;
      };
    };
