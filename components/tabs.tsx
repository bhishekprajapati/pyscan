"use client";

import { Tab, Tabs as HTabs } from "@heroui/react";

type Props = {
  list: { key: string; title: string; tab: React.ReactNode }[];
};

export const Tabs: React.FC<Props> = ({ list }) => {
  return (
    <HTabs>
      {list.map(({ tab: children, key, title }) => (
        <Tab key={key} title={title}>
          {children}
        </Tab>
      ))}
    </HTabs>
  );
};
