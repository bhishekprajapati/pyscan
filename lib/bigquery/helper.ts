import { data as _data, error as _error } from "@/utils/misc";

type QueryError<R = undefined> = {
  error?: R;
  reason: string;
  /**
   * `true` if the error is fatal
   * @default false
   */
  fatal?: boolean;
  /** can retry request */
  retry: boolean;
  /**
   * If `true` then error should not be shared with the client
   * @default true
   */
  isInternal?: boolean;
};

export const error = <R>({
  fatal = false,
  isInternal = true,
  ...rest
}: QueryError<R>) =>
  _error({
    fatal,
    isInternal,
    ...rest,
  });

export const data = <D>(data: D) => _data({ data });
