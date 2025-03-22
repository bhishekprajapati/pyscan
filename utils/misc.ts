export const serializeBigInt = (v: unknown): string | unknown =>
  typeof v === "bigint" ? v.toString() : v;

export const data = <T extends Record<any, any>>(data: T) => ({
  success: true as const,
  ...data,
});

export const error = <T extends Record<any, any>>(err: T) => ({
  success: false as const,
  ...err,
});

class Result<T> {
  constructor(public readonly value: T) {}
}

/**
 * `Result` contains success or failure responses
 * which are returned by safe methods
 */
export const result = <T>(value: T) => new Result(value);

export const withMeta = <T extends (...args: any[]) => any, M>(
  fn: T,
  meta: M,
): T & { meta: M } => {
  (fn as any)["meta"] = meta;
  return fn as any;
};

export const makeRotator = <T extends any[]>(arr: T) => {
  if (arr.length === 0) {
    throw Error("Provided array must be non-empty");
  }

  let i = 0;
  return () => arr[i++ % arr.length];
};
