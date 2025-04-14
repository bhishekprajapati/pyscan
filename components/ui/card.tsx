"use client";

import {
  cn,
  Card as HCard,
  CardBody as HCardBody,
  CardHeader as HCardHeader,
  CardFooterProps as HCardFooterProps,
  CardFooter as HCardFooter,
  Tooltip,
  TooltipProps,
  type CardProps as HCardProps,
} from "@heroui/react";
import { CircleHelp, LucideProps, Zap, ZapOff } from "lucide-react";
import type { FC } from "react";
import TimeAgo from "react-timeago";
import { FMono } from "../text";
import ms from "ms";

type CardProps = HCardProps;
export const Card: FC<CardProps> = ({ className, ...rest }) => (
  <HCard
    className={
      "group rounded-xl bg-primary-100 bg-opacity-[0.04] hover:shadow-lg hover:shadow-default/25 " +
      className
    }
    {...rest}
  />
);

type CardHeaderProps = React.ComponentPropsWithoutRef<typeof HCardHeader>;
export const CardHeader: FC<CardHeaderProps> = ({ className, ...rest }) => (
  <HCardHeader className={"gap-4 " + className} {...rest} />
);

type CardTimestampProps = {
  date?: Date;
  /** Update frequency in seconds */
  frequency?: number;
  /**
   * @default false
   */
  isRefreshing?: boolean;
};

export const CardTimestamp: React.FC<CardTimestampProps> = ({
  date,
  frequency,
  isRefreshing,
}) => (
  <Tooltip
    content={
      <div className="max-w-64 p-2">
        {frequency && (
          <div>
            Updated Every:{" "}
            {ms(frequency * 1000, {
              long: true,
            })}
          </div>
        )}
      </div>
    }
  >
    <span className="inline-flex items-center gap-2">
      {date && (
        <FMono className="mb-1 text-sm dark:text-gray-500">
          Last Updated <TimeAgo date={date} />
        </FMono>
      )}
      {isRefreshing ? (
        <Zap
          size={16}
          className={cn("text-warning", isRefreshing ? "animate-pulse" : "")}
        />
      ) : (
        <ZapOff size={16} className="text-warning" />
      )}
    </span>
  </Tooltip>
);

type CardHelpProps = {
  tooltipProps?: TooltipProps;
  iconProps?: LucideProps;
};

export const CardHelp: React.FC<CardHelpProps> = (props) => {
  const { tooltipProps, iconProps } = props;
  const { className: tClassName, ...tRest } = tooltipProps ?? {};
  const { className: iClassName, ...iRest } = iconProps ?? {};

  return (
    <Tooltip className={cn("max-w-64 p-2", tClassName)} {...tRest}>
      <CircleHelp
        className={cn("dark:text-default-200", iClassName)}
        size={16}
        {...iRest}
      />
    </Tooltip>
  );
};

type CardHeadingProps = React.HTMLProps<HTMLHeadingElement>;
export const CardHeading: FC<CardHeadingProps> = ({ className, ...rest }) => (
  <h2
    className={cn(
      "me-auto text-default-foreground/50 transition-colors group-hover:text-primary",
      className,
    )}
    {...rest}
  />
);

type CardBodyProps = React.ComponentPropsWithoutRef<typeof HCardBody>;

export const CardBody: FC<CardBodyProps> = ({ className, ...rest }) => (
  <HCardBody className={"p-4 " + className} {...rest} />
);

export const CardFooter: React.FC<HCardFooterProps> = ({
  className,
  ...rest
}) => <HCardFooter className={" " + className} {...rest} />;
