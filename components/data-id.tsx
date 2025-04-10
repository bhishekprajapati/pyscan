"use client";

import { cn } from "@heroui/react";
import { useEffect } from "react";

// data-id-hovered

export const DataId: React.FC<
  React.HTMLProps<HTMLSpanElement> & { dataId: string }
> = ({ className, dataId, ...rest }) => (
  <span
    data-hoverable
    data-id={dataId}
    className={cn(
      className,
      "inline-block rounded-xl border-3 border-dashed border-transparent px-2 [&.data-id-hovered]:!border-warning",
    )}
    {...rest}
  />
);

export const DataIdWatcher = () => {
  useEffect(() => {
    document.querySelectorAll("[data-hoverable]").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        const id = el.getAttribute("data-id");
        const targets = document.querySelectorAll(`[data-id="${id}"]`);
        if (targets.length > 1)
          targets.forEach((m) => m.classList.add("data-id-hovered"));
      });

      el.addEventListener("mouseleave", () => {
        const id = el.getAttribute("data-id");
        document
          .querySelectorAll(`[data-id="${id}"]`)
          .forEach((m) => m.classList.remove("data-id-hovered"));
      });
    });
    return () => {};
  }, []);

  return null;
};
