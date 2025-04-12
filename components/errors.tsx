import { cn } from "@heroui/react";
import { TriangleAlert } from "lucide-react";

type ComponentErrorFallbackProps = React.HTMLProps<HTMLDivElement>;
export const ComponentErrorFallback: React.FC<ComponentErrorFallbackProps> = ({
  className,
  ...rest
}) => (
  <div
    className={cn(
      "flex h-full flex-col items-center justify-center gap-2 rounded-md bg-[#09090975] p-32 text-danger",
      className,
    )}
    {...rest}
  >
    <TriangleAlert />
    <p>Error occurred</p>
  </div>
);
