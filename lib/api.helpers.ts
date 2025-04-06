/**
 * This module exports higher order functions,
 * to execute route handlers in public or private context.
 */

import { auth as getSession } from "@/auth";
import type { Session } from "next-auth";
import { NextResponse } from "next/server";

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
    validation_error: "Bad input",
    authentication_required: "You are unautenticated",
    internal_server_error: "Something went wrong on the server",
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
  req: Request,
  res: THandlerResponse,
  ctx: THandlerContext<TParams>,
) => Promise<R>;
type TDefaultParams = Record<string, string | string[]> | undefined;

/**
 * Public API route handler
 */
export const api = <R extends NextResponse<any>, TParams = TDefaultParams>(
  handler: THandler<TParams, R>,
) =>
  async function publicRouteHandler(
    req: Request,
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

type TPrivateHandlerContext<TParams> = {
  params: TParams;
  session: Session;
};

type TPrivateHandler<TParams, R> = (
  req: Request,
  res: THandlerResponse,
  ctx: TPrivateHandlerContext<TParams>,
) => Promise<R>;

/**
 * Private API route handler
 */
export const auth = <R extends NextResponse<any>, TParams = TDefaultParams>(
  handler: TPrivateHandler<TParams, R>,
) =>
  async function privateRouteHandler(
    req: Request,
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

export type InferApiResponse<THandler extends (...args: any[]) => any> =
  THandler extends (...args: any[]) => Promise<NextResponse<infer R>>
    ? R
    : never;
