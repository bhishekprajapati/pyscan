import { cn, Spinner } from "@heroui/react";

export const SuspendedComponentFallback: React.FC<
  React.HTMLProps<HTMLDivElement>
> = ({ className, ...rest }) => (
  <div
    className={cn(
      "flex items-center justify-center bg-[#09090975] dark:text-gray-500",
      className,
    )}
    {...rest}
  >
    <Spinner color="current" />
  </div>
);
