"use client";

import { Clock9 } from "lucide-react";
import TimeAgo from "react-timeago";

type TimestampProps = {
  stamp: Date | string | bigint;
  ago?: boolean;
};

const Timestamp = ({ stamp, ago }: TimestampProps) => {
  const date =
    stamp instanceof Date
      ? stamp
      : typeof stamp === "string"
        ? new Date(stamp)
        : new Date(Number(stamp) * 1000);

  return (
    <span className="inline-flex items-center gap-2">
      <Clock9 size={16} className="inline-block" />
      <TimeAgo date={date} /> ({date.toString()})
    </span>
  );
};

export default Timestamp;
