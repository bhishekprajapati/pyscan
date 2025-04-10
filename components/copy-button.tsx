"use client";

import {
  addToast,
  Button,
  ButtonProps,
  ToastProps,
  Tooltip,
} from "@heroui/react";
import copy from "copy-to-clipboard";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

type CopyButtonProps = Omit<ButtonProps, "children"> & {
  text?: string;
  tooltipText?: string;
  onCopyToast?: Partial<ToastProps>;
};

const CopyButton: React.FC<CopyButtonProps> = (props) => {
  const [showCheck, setShowCheck] = useState(false);

  const {
    text = "",
    tooltipText = "Click to copy",
    onCopyToast,
    ...restProps
  } = props;

  const handleCopy = () => {
    copy(text);
    setShowCheck(true);
    setTimeout(() => setShowCheck(false), 2000);
    onCopyToast && addToast(onCopyToast);
  };

  return (
    <Tooltip content={tooltipText}>
      <Button size="sm" {...restProps} isIconOnly onPress={handleCopy}>
        {showCheck ? <Check size={12} /> : <Copy size={12} />}
      </Button>
    </Tooltip>
  );
};

export default CopyButton;
