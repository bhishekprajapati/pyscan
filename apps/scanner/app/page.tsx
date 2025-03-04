"use client";

import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import TransactionTable from "@/components/transaction-table";
import env from "@/env.client";

export default function Home() {
  return (
    <div className="py-16">
      <Tabs>
        <Tab key="transactions" title="Transactions">
          <TransactionTable
            endpoint={`${env.NEXT_PUBLIC_NODE_SERVICE_URL}/ws`}
            initialData={JSON.parse(
              '[{"address":"0x6c3ea9036406852006290770bedfcaba0e23a0e8","topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000f82230873c395508ae6cb61df3a648a71edb950e","0x000000000000000000000000a9d1e08c7793af67e9d92fe308d5697fb81d3e43"],"data":"0x000000000000000000000000000000000000000000000000000000000834d480","blockNumber":"21971864","transactionHash":"0xaa47ee8079b46ad744c270ec963afb56e09a44f1d34e4b3507a86b08cabdb357","transactionIndex":50,"blockHash":"0xbc232905e04b94c8b3f31d56697cb0cacdb29d464874c94abfec26fa369ed106","logIndex":154,"removed":false},{"address":"0x6c3ea9036406852006290770bedfcaba0e23a0e8","topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000264bd8291fae1d75db2c5f573b07faa6715997b5","0x0000000000000000000000006df79603c6e33b85e9748fb10fb2d0024664ac80"],"data":"0x000000000000000000000000000000000000000000000000000000000d0aeda0","blockNumber":"21971851","transactionHash":"0x29dc755bcd6b4a095e03238237b36d78bbde0019678fa1b610429578513618f2","transactionIndex":33,"blockHash":"0x4044d8c61dcafb88d8470ca7ae36c6236423e212210d2d84c80e8a807905704d","logIndex":167,"removed":false},{"address":"0x6c3ea9036406852006290770bedfcaba0e23a0e8","topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000264bd8291fae1d75db2c5f573b07faa6715997b5","0x0000000000000000000000002e78f0e59bcbef9d3a6f269751050ce71e620cce"],"data":"0x0000000000000000000000000000000000000000000000000000000000989680","blockNumber":"21971828","transactionHash":"0x463908035d7f5f10da47c5534c9d76e0fa9e1e80f46de4cd61801b4975c3b5a5","transactionIndex":10,"blockHash":"0x9480c3aa29bf3d03d75218f1abd3ba2aefccb125028a9f39892c3c2f212c70fb","logIndex":35,"removed":false},{"address":"0x6c3ea9036406852006290770bedfcaba0e23a0e8","topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000264bd8291fae1d75db2c5f573b07faa6715997b5","0x0000000000000000000000000d1768530fa4870f55516c421e8c0f5f852d79f1"],"data":"0x00000000000000000000000000000000000000000000000000000000069afaa0","blockNumber":"21971826","transactionHash":"0x75dccb3945c687127e886c81cce84cd633b03ef8ac74af693f98c58c298bf4f1","transactionIndex":38,"blockHash":"0xf551321b820f7af4853dff0565c924ccb6adaaf7a4b37f6ec97d671709e8dc2e","logIndex":196,"removed":false},{"address":"0x6c3ea9036406852006290770bedfcaba0e23a0e8","topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000221e0b2a88312382eabe041ee679f49e99d8a4d0","0x0000000000000000000000002982bb64bcd07ac3315c32cb2bb7e5e8a2de7d67"],"data":"0x00000000000000000000000000000000000000000000000000000000267e9570","blockNumber":"21971822","transactionHash":"0x37c684de5113465b10d9dd7d68a0b0a057155873217adee188499ed521386d57","transactionIndex":36,"blockHash":"0xda10573386f8afcab7886d40fbc04ee646546fef91e3837a6264b5403e64b447","logIndex":87,"removed":false}]',
              (k, v) => (k === "blockNumber" ? BigInt(v) : v),
            )}
          />
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
