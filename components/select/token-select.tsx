"use client";

import { cn } from "@heroui/react";
import { Select, SelectItem, SelectProps } from "@heroui/select";
import { useMemo } from "react";

export type TokenSelectOption = {
  key?: string;
  address: string;
  label: string;
  logo: string;
  /**
   * @default false
   */
  disabled?: boolean;
  defaultSelected?: boolean;
};

export type TokenSelectProps = {
  options: TokenSelectOption[];
} & Omit<
  SelectProps,
  "defaultSelectedKeys" | "disabledKeys" | "items" | "children"
>;

const TokenSelect = ({
  options,
  className,
  ...restProps
}: TokenSelectProps) => {
  const disabledKeys = useMemo(
    () =>
      options
        .filter(({ disabled }) => disabled === true)
        .map(({ key, address }) => key ?? address),
    [options],
  );

  const defaultSelectedKeys = useMemo(
    () =>
      options
        .filter(({ defaultSelected }) => defaultSelected === true)
        .map(({ key, address }) => key ?? address),
    [options],
  );

  return (
    <Select
      className={cn("w-40", className)}
      defaultSelectedKeys={defaultSelectedKeys}
      disabledKeys={disabledKeys}
      selectionMode="multiple"
      items={options}
      size="sm"
      aria-label="select a token to add or remove"
      {...restProps}
    >
      {(token) => (
        <SelectItem
          key={token.key ?? token.address}
          textValue={token.label}
          aria-label={token.label}
        >
          <div className="flex items-center gap-2">
            <img
              src={token.logo}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-small">{token.label}</span>
          </div>
        </SelectItem>
      )}
    </Select>
  );
};

export default TokenSelect;
