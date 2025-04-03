import { Card, CardBody, CardFooter, CardHeader } from "@/components/card";
import TransfersTable from "@/components/tables/transfers";
import { Divider } from "@heroui/react";

const PyusdTokenTransfers = async () => (
  <div className="m-2">
    <Card>
      <CardHeader>
        <h2>PYUSD Token Transfers</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <TransfersTable />
      </CardBody>
      <Divider />
      <CardFooter></CardFooter>
    </Card>
  </div>
);

export default PyusdTokenTransfers;
