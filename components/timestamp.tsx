"use client";

import { Clock9 } from "lucide-react";
import TimeAgo, { type Props } from "react-timeago";

type TimestampProps = {
  stamp: Date | string | bigint;
  ago?: boolean;
  icon?: boolean;
  string?: boolean;
  formatter?: Pick<Props, "formatter">;
};

const Timestamp = ({
  stamp,
  ago,
  icon = true,
  string = true,
}: TimestampProps) => {
  const date =
    stamp instanceof Date
      ? stamp
      : typeof stamp === "string"
        ? new Date(stamp)
        : new Date(Number(stamp) * 1000);

  return (
    <span className="inline-flex items-center gap-2">
      {icon && <Clock9 size={16} className="inline-block" />}
      <TimeAgo date={date} /> {string && <>({date.toString()})</>}
    </span>
  );
};

export default Timestamp;
