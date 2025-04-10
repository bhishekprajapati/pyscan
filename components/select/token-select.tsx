"use client";

import type { TokenType } from "@/lib/token";
import { cn } from "@heroui/react";
import { Select, SelectItem, SelectProps } from "@heroui/select";
import { useMemo } from "react";

export type TokenSelectOption = {
  tokenType: TokenType<string>;
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

const getOptionKey = (opt: TokenSelectOption) => opt.tokenType.getSymbol();
const isDisabled = (opt: TokenSelectOption) => opt.disabled === true;
const isDefault = (opt: TokenSelectOption) => opt.defaultSelected === true;

const TokenSelect = (props: TokenSelectProps) => {
  const { options, className, ...restProps } = props;

  const disabledKeys = useMemo(
    () => options.filter(isDisabled).map(getOptionKey),
    [options],
  );

  const defaultSelectedKeys = useMemo(
    () => options.filter(isDefault).map(getOptionKey),
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
      {(opt) => (
        <SelectItem
          key={getOptionKey(opt)}
          textValue={opt.tokenType.getName()}
          aria-label={opt.tokenType.getName()}
        >
          <div className="flex items-center gap-2">
            <img
              src={opt.tokenType.getLogo()}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-small">{opt.tokenType.getName()}</span>
          </div>
        </SelectItem>
      )}
    </Select>
  );
};

export default TokenSelect;
