"use client";

import type { TableProps } from "@heroui/react";

export const col = (name: string, uid: string) => ({ name, uid });

export const tableClassName: TableProps["className"] =
  "overflow-x-auto bg-default";

export const tableClassNames: TableProps["classNames"] = {
  th: "bg-transparent border-b border-b-divider text-sm",
  tbody:
    "[&>tr:nth-child(2n+1)]:bg-primary [&>tr:nth-child(2n+1)]:bg-opacity-[0.01]",
  thead: "py-8",
};
