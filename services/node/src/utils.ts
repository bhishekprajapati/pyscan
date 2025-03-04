export const serializeBigInt = (v: unknown): string | unknown =>
  typeof v === "bigint" ? v.toString() : v;
