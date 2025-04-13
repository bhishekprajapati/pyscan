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
  <HCardHeader className={"gap-2 " + className} {...rest} />
);

type CardTimestampProps = {
  date: Date;
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
      <div className="ms-auto max-w-64 p-2">
        <FMono className="mb-1">
          Last Updated <TimeAgo date={date} />
        </FMono>
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
    {isRefreshing ? (
      <Zap
        size={16}
        className={cn(
          "ms-auto text-warning",
          isRefreshing ? "animate-pulse" : "",
        )}
      />
    ) : (
      <ZapOff size={16} className="ms-auto text-warning" />
    )}
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
    <Tooltip className={cn("max-w-64 bg-default-50", tClassName)} {...tRest}>
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
      "text-default-foreground/50 transition-colors group-hover:text-primary",
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
