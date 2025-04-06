"use client";

import {
  addToast,
  Button,
  ButtonProps,
  ToastProps,
  Tooltip,
} from "@heroui/react";
import copy from "copy-to-clipboard";
import { Copy } from "lucide-react";

type CopyButtonProps = Omit<ButtonProps, "children"> & {
  text?: string;
  tooltipText?: string;
  onCopyToast?: Partial<ToastProps>;
};

const CopyButton: React.FC<CopyButtonProps> = ({
  text = "",
  tooltipText = "Click to copy",
  onCopyToast,
  ...restProps
}) => {
  const handleCopy = () => {
    copy(text);
    onCopyToast && addToast(onCopyToast);
  };

  return (
    <Tooltip content={tooltipText}>
      <Button size="sm" {...restProps} isIconOnly onPress={handleCopy}>
        <Copy size={12} />
      </Button>
    </Tooltip>
  );
};

export default CopyButton;
