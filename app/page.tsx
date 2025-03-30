"use client";

import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import { TransfersTable } from "@/components/tables";

export default function Home() {
  return (
    <div>
      <Tabs>
        <Tab key="transfers" title="Transfers">
          <TransfersTable />
        </Tab>
        <Tab key="holders" title="Holders">
          <Card>
            <CardBody>Holders Tab</CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
