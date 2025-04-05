"use client";

import { Avatar, Skeleton } from "@heroui/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

import { SignIn } from "./buttons";
import { AuthStatusLoadFallback, SignedIn, SignedOut } from "./client";
import { signOut } from "next-auth/react";

const ProfileMenu = ({ children }: { children: React.ReactNode }) => (
  <Dropdown>
    <DropdownTrigger>{children}</DropdownTrigger>
    <DropdownMenu aria-label="user actions">
      <DropdownItem key="delete" onPress={() => signOut()} color="danger">
        Sign Out
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
);

export const RenderUserAvatar = () => (
  <div className="me-4">
    <SignedIn>
      {({ user }) => {
        if (user?.image)
          return (
            <ProfileMenu>
              <Avatar size="sm" src={user?.image} />
            </ProfileMenu>
          );
        if (user?.name)
          return (
            <ProfileMenu>
              <Avatar size="sm" name={user.name} />
            </ProfileMenu>
          );
      }}
    </SignedIn>
    <AuthStatusLoadFallback>
      <Skeleton className="h-9 w-9 rounded-full" />
    </AuthStatusLoadFallback>
    <SignedOut>
      <SignIn color="primary" />
    </SignedOut>
  </div>
);
