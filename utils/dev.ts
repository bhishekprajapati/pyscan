export const devOnly = <T, U>(value: T, fallback: U) =>
  process.env.NODE_ENV === "development" ? fallback : value;
