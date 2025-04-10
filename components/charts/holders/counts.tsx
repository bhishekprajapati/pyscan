"use client";

import {
  ChartCard,
  ChartCardBody,
  ChartCardHeader,
  ChartCardHeading,
} from "../card";

const HoldersCount = () => {
  return (
    <ChartCard>
      <ChartCardHeader>
        <ChartCardHeading>Holders</ChartCardHeading>
        <span className="ms-auto" />
      </ChartCardHeader>
      <ChartCardBody></ChartCardBody>
    </ChartCard>
  );
};

export default HoldersCount;
