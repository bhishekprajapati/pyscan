/**
 * This module exports higher order functions,
 * to execute route handlers in public or private context.
 */

import "server-only";
import { auth as getSession } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import type { Session } from "next-auth";
import redis from "./redis";

type TLimiterOptions = {
  /**
   * @default Ratelimit.slidingWindow(5, "1s")
   */
  algo?: ReturnType<typeof Ratelimit.slidingWindow>;
  /**
   * @default true
   */
  enabled?: boolean;
};

type TLimitedFn<R> = (
  req: NextRequest,
  ctx: { params: TDefaultParams },
) => Promise<R>;

export const limiter = <R>(
  limitedFn: TLimitedFn<R>,
  opts: TLimiterOptions = {},
) => {
  const { algo = Ratelimit.slidingWindow(5, "1s"), enabled = true } = opts;
  const rate = new Ratelimit({
    limiter: algo,
    redis,
  });

  return async function limited(
    req: NextRequest,
    { params }: { params: TDefaultParams },
  ) {
    // TODO: add cloudlfare proxy to production server
    // req.headers.get("cf-connecting-ip")
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const { limit, remaining, reset } = await rate.limit(ip);

    if (enabled && remaining === 0) {
      return error(
        { name: "rate_limit_error" },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        },
      );
    }

    return limitedFn(req, { params });
  };
};

const data = <T>(d: T, init?: ResponseInit) =>
  NextResponse.json(
    {
      ok: true as const,
      data: d,
    },
    init,
  );

const error = (() => {
  const errorNames = {
    rate_limit_error: "rate limited. Please try again after some time",
    validation_error: "Bad input",
    authentication_required: "You are unautenticated",
    internal_server_error: "Something went wrong on the server",
    email_not_found: "action aborted due to no email",
    query_limit_exceeded:
      "Query limited exceeded. Only 100MB free byte scanned allowed per query and only 10 queries allowed each day.",
  };

  type TErrorName = keyof typeof errorNames;
  type TError<T extends TErrorName> = { name: T };
  return <T extends TError<TErrorName>>(error: T, init?: ResponseInit) => {
    const { status = 500, headers, statusText } = init ?? {};
    return NextResponse.json(
      {
        ok: false as const,
        error: {
          ...error,
          message:
            "message" in error && typeof error.message === "string"
              ? error.message
              : (errorNames[error.name] as string),
        },
      },
      {
        status,
        headers,
        statusText,
      },
    );
  };
})();

type THandlerResponse = {
  data: typeof data;
  error: typeof error;
};

type THandlerContext<TParams> = {
  params: TParams;
};

type THandler<TParams, R> = (
  req: NextRequest,
  res: THandlerResponse,
  ctx: THandlerContext<TParams>,
) => Promise<R>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TDefaultParams = Promise<any>;

/**
 * Public API route handler
 */
export const api = <R extends NextResponse<unknown>, TParams = TDefaultParams>(
  handler: THandler<TParams, R>,
) => {
  return async function publicRouteHandler(
    req: NextRequest,
    { params }: { params: TParams },
  ) {
    const res: THandlerResponse = {
      data,
      error,
    };
    try {
      const ctx: THandlerContext<TParams> = {
        params,
      };
      return handler(req, res, ctx);
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.error(err);
      return res.error({
        name: "authentication_required",
      });
    }
  };
};

type TPrivateHandlerContext<TParams> = {
  params: TParams;
  session: Session;
};

type TPrivateHandler<TParams, R> = (
  req: NextRequest,
  res: THandlerResponse,
  ctx: TPrivateHandlerContext<TParams>,
) => Promise<R>;

/**
 * Private API route handler
 */
export const auth = <R extends NextResponse<unknown>, TParams = TDefaultParams>(
  handler: TPrivateHandler<TParams, R>,
) =>
  async function privateRouteHandler(
    req: NextRequest,
    { params }: { params: TParams },
  ) {
    const res: THandlerResponse = {
      data,
      error,
    };

    try {
      const session = await getSession();
      if (!session)
        return res.error(
          {
            name: "authentication_required",
          },
          {
            status: 403,
          },
        );
      return handler(req, res, { params, session });
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.error(err);
      return res.error({
        name: "internal_server_error",
      });
    }
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferApiResponse<THandler extends (...args: any[]) => any> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  THandler extends (...args: any[]) => Promise<NextResponse<infer R>>
    ? R
    : never;
