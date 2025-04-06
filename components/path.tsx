"use client";

import { usePathname } from "next/navigation";

type PathOnlyProps = {
  matcher: string | ((path: string | null) => boolean);
  children: React.ReactNode;
};

export const PathOnly: React.FC<PathOnlyProps> = ({ matcher, children }) => {
  const path = usePathname();
  const hasMatched =
    typeof matcher === "string" ? path === matcher : matcher(path);
  return hasMatched ? children : null;
};
