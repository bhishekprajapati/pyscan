"use client";

import JsonView from "@uiw/react-json-view";
import { darkTheme } from "@uiw/react-json-view/dark";

export const LogsJsonView = ({ value }: { value: object | undefined }) => (
  <div className="rounded-xl border border-divider p-4 [&_*]:font-mono">
    <JsonView value={value} style={darkTheme} className="!bg-transparent" />
  </div>
);
