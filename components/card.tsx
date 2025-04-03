import {
  cn,
  Card as HCard,
  CardBody as HCardBody,
  CardFooter as HCardFooter,
  CardHeader as HCardHeader,
  type CardFooterProps,
  type CardProps,
} from "@heroui/react";

type CardBodyProps = React.ComponentPropsWithoutRef<typeof HCardBody>;
type CardHeaderProps = React.ComponentPropsWithoutRef<typeof HCardHeader>;

export const Card: React.FC<CardProps> = ({ className, ...rest }) => (
  <HCard className={cn("rounded-md", className)} {...rest} />
);

export const CardBody: React.FC<CardBodyProps> = ({ className, ...rest }) => (
  <HCardBody
    className={cn("bg-default/50 p-0 text-default-foreground", className)}
    {...rest}
  />
);

export const CardHeader: React.FC<CardHeaderProps> = ({
  className,
  children,
  ...rest
}) => (
  <HCardHeader
    className={cn(
      "block rounded-none bg-default p-6 text-default-foreground",
      className,
    )}
    {...rest}
  >
    <div className="flex items-center justify-between font-serif text-xl font-bold">
      {children}
    </div>
  </HCardHeader>
);

export const CardFooter: React.FC<CardFooterProps> = ({
  className,
  ...rest
}) => <HCardFooter className={cn("justify-center", className)} {...rest} />;
