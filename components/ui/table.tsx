"use client";

import type { TableProps } from "@heroui/react";

export const col = (name: string, uid: string) => ({ name, uid });

export const tableClassName: TableProps["className"] =
  "overflow-x-auto bg-grey-700";

export const tableClassNames: TableProps["classNames"] = {
  th: "bg-primary-100 bg-opacity-[0.04] rounded-none border-b border-b-divider text-sm",
  tbody: "[&>tr:nth-child(2n+1)]:bg-default",
  thead: "py-8 [&_*]:!rounded-none",
};
