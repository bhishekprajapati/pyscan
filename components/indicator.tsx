import { Tooltip } from "@heroui/react";
import { Circle } from "lucide-react";

export const RealTimeIndicator = () => (
  <Tooltip content="⚡ Real-Time Data">
    <Circle className="animate-pulse fill-success stroke-divider" size={8} />
  </Tooltip>
);
