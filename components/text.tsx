"use client";

import { Button } from "@heroui/button";
import { cn } from "@heroui/react";
import { Tooltip } from "@heroui/tooltip";
import copy from "copy-to-clipboard";
import { ClipboardCopy } from "lucide-react";
import { FC, HTMLProps, useState } from "react";

export const TextTruncate: FC<HTMLProps<HTMLSpanElement>> = ({
  className,
  ...rest
}) => <span className={cn("line-clamp-1", className)} {...rest} />;

export const TextClipboardCopy = ({ content }: { content: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const pressHandler = () => {
    copy(content);
  };

  return (
    <Tooltip
      content={content}
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <Button
        isIconOnly
        aria-label="Copy to clipboard"
        size="sm"
        variant="ghost"
        className="border-none dark:text-gray-500"
        onPress={pressHandler}
      >
        <ClipboardCopy size={16} />
      </Button>
    </Tooltip>
  );
};

export type FMonoProps = React.HTMLProps<HTMLSpanElement>;
export const FMono: React.FC<FMonoProps> = ({
  children,
  className,
  ...restProps
}) => (
  <span className={cn("font-mono", className)} {...restProps}>
    {children}
  </span>
);
