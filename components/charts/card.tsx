import { cn, Tooltip } from "@heroui/react";
import { CircleHelp } from "lucide-react";
import type { FC, HTMLProps, ReactNode } from "react";
import TimeAgo from "react-timeago";

import { FMono, FMonoProps } from "../text";

export const ChartCard: FC<HTMLProps<HTMLDivElement>> = ({ children }) => (
  <div className="h-full overflow-hidden rounded-xl bg-primary-100 bg-opacity-[0.04]">
    {children}
  </div>
);

export const ChartCardHeader: FC<HTMLProps<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div
    className={cn(
      "flex items-center gap-2 border-b border-divider bg-default px-4 py-2",
      className,
    )}
    {...rest}
  >
    {children}
  </div>
);

export const ChartCardTimestamp = ({ date }: { date: Date }) => (
  <FMono className="ms-auto dark:text-default-200">
    <TimeAgo date={date} />
  </FMono>
);

export const ChartCardHelp = ({ content }: { content: ReactNode }) => (
  <Tooltip className="max-w-64 bg-default-50" content={content}>
    <CircleHelp className="dark:text-default-200" size={16} />
  </Tooltip>
);

export const ChartCardHeading: FC<FMonoProps> = ({
  children,
  className,
  ...rest
}) => (
  <FMono
    className={cn("inline-block dark:text-default-600", className)}
    {...rest}
  >
    {children}
  </FMono>
);

export const ChartCardBody: FC<HTMLProps<HTMLDivElement>> = ({
  children,
  ...rest
}) => <div {...rest}>{children}</div>;
