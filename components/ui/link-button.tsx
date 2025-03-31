import { button, VariantProps } from "@heroui/react";
import Link from "next/link";

type LinkButtonProps = Pick<
  VariantProps<typeof button>,
  "variant" | "color" | "radius" | "size" | "isIconOnly"
> &
  React.ComponentPropsWithoutRef<typeof Link>;

const LinkButton = (props: LinkButtonProps) => {
  const { variant, className, color, radius, size, isIconOnly, ...restProps } =
    props;
  return (
    <Link
      className={button({
        variant,
        color,
        radius,
        size,
        isIconOnly,
        className: "hover:cursor-pointer",
      })}
      {...restProps}
    />
  );
};

export default LinkButton;
