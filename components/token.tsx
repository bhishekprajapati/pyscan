import type { SerializedTokenData } from "@/lib/token";
import { cn } from "@heroui/react";

type TokenLogoProps = {
  token: SerializedTokenData;
} & React.HTMLProps<HTMLImageElement>;

export const TokenLogo: React.FC<TokenLogoProps> = ({
  token,
  className,
  ...rest
}) => (
  <img
    src={token.logo}
    className={cn("inline-block h-6 w-6", className)}
    {...rest}
  />
);
