// const data = <T>(d: T) => ({
//   ok: true as const,
//   data: d,
// });

export type ApiFnReturnType<TData, TErrorName extends string> = Promise<
  { ok: true; data: TData } | { ok: false; error: TError<TErrorName> }
>;

export type BaseFetcherOptions = Pick<RequestInit, "signal">;

export type TError<T extends string> = {
  name: T;
  message: string;
};

export const error = <T extends string>(error: TError<T>) => ({
  ok: false as const,
  error,
});

export const fetcher = async <TJsonResponse>(url: URL, init?: RequestInit) => {
  try {
    const res = await fetch(url, init);
    const json = (await res.json()) as TJsonResponse;
    return json;
  } catch (err) {
    console.error(err);
    return error({
      name: "unknown-error",
      message: "Something went wrong",
    });
  }
};

export const createURL = (baseUrl?: string, prefix = "") => {
  return function (path: string) {
    return new URL(`${prefix}${path}`, baseUrl ?? window.location.origin);
  };
};

export type PathMakerFn = ReturnType<typeof createURL>;
