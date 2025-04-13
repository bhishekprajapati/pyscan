"use client";

import { cn } from "@heroui/react";
import { Select, SelectItem, SelectProps } from "@heroui/select";
import { useMemo } from "react";

export type TimeframeOption = {
  key: string;
  label: string;
  /**
   * @default false
   */
  disabled?: boolean;
  defaultSelected?: boolean;
};

export type TimeframeSelectProps = {
  options: TimeframeOption[];
} & Omit<
  SelectProps,
  "defaultSelectedKeys" | "disabledKeys" | "items" | "children"
>;

const TimeframeSelect = (props: TimeframeSelectProps) => {
  const { options, className, ...restProps } = props;

  const disabledKeys = useMemo(
    () =>
      options.filter(({ disabled }) => disabled === true).map(({ key }) => key),
    [options],
  );

  const defaultSelectedKeys = options
    .filter(({ defaultSelected }) => defaultSelected === true)
    .map(({ key }) => key);

  return (
    <Select
      className={cn("w-28", className)}
      disabledKeys={disabledKeys}
      items={options}
      defaultSelectedKeys={defaultSelectedKeys}
      aria-label="select a timeframe to add or remove"
      size="sm"
      {...restProps}
    >
      {(tf) => (
        <SelectItem key={tf.key} textValue={tf.label} aria-label={tf.label}>
          {tf.label}
        </SelectItem>
      )}
    </Select>
  );
};

export default TimeframeSelect;
