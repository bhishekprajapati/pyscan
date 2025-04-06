import type { ApiFnReturnType } from "@/lib/api.sdk";

export const makeMutationFn =
  <TFn extends (...args: any[]) => ApiFnReturnType<any, any>>(apiFn: TFn) =>
  async (...args: Parameters<TFn>) => {
    const result = await apiFn(...args);
    if (!result.ok) {
      throw Error(`${result.error.name}: ${result.error.message}`);
    }
    return result.data as Extract<
      Awaited<ReturnType<TFn>>,
      { ok: true }
    >["data"];
  };
