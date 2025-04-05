"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";

type SignedInProps = {
  opts?: Parameters<typeof useSession>["0"];
  children: React.ReactNode | ((data: Session) => React.ReactNode);
};

export const SignedIn: React.FC<SignedInProps> = (props) => {
  const { opts, children } = props;
  const { data, status } = useSession(opts);
  return status === "authenticated" ? (
    typeof children === "function" ? (
      children(data)
    ) : (
      children
    )
  ) : (
    <></>
  );
};

type SignedOutProps = {
  opts?: Parameters<typeof useSession>["0"];
  children: React.ReactNode;
};

export const SignedOut: React.FC<SignedOutProps> = (props) => {
  const { opts, children } = props;
  const { status } = useSession(opts);
  return status === "unauthenticated" ? children : <></>;
};

type AuthStatusLoadFallbackProps = {
  opts?: Parameters<typeof useSession>["0"];
  children: React.ReactNode;
};

export const AuthStatusLoadFallback: React.FC<AuthStatusLoadFallbackProps> = (
  props,
) => {
  const { opts, children } = props;
  const { status } = useSession(opts);
  return status === "loading" ? children : <></>;
};
