import { CSVLink } from "react-csv";
import { button, VariantProps } from "@heroui/react";

type CSVLinkProps = React.ComponentPropsWithoutRef<typeof CSVLink>;

type DownloadButtonProps = {
  data: CSVLinkProps["data"];
  filename: CSVLinkProps["filename"];
  children?: React.ReactNode;
  className?: string | undefined;
} & VariantProps<typeof button>;

const DownloadButton: React.FC<DownloadButtonProps> = (props) => {
  const { data, filename, className, children, ...buttonVariant } = props;

  return (
    <CSVLink
      data={data}
      filename={filename}
      className={button({
        ...buttonVariant,
        className,
      })}
    >
      {children}
    </CSVLink>
  );
};

export default DownloadButton;
