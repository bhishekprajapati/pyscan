"use client";

import { Button, ButtonProps } from "@heroui/react";
import { signIn, signOut } from "next-auth/react";

export const SignIn: React.FC<ButtonProps> = (props) => (
  <Button {...props} onPress={() => signIn("google")}>
    SignIn
  </Button>
);

export const SignOut: React.FC<ButtonProps> = (props) => (
  <Button {...props} onPress={() => signOut()}>
    Sign Out
  </Button>
);
