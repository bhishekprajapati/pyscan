"use client";

import { useEffect, useState } from "react";
import { decodeAbiParameters, parseAbiParameters } from "viem";

const decodeAddress = (hex: `0x${string}`) =>
  decodeAbiParameters(parseAbiParameters("address"), hex)[0];

export type UseTransactionsOptions = {
  /**
   * @default []
   */
  initialData?: Transaction[];
  /**
   * transaction web socket endpoint
   */
  endpoint: string;
};

const parseTransaction = (message: any) => {
  return JSON.parse(message, (k, v) =>
    k === "blockNumber" ? BigInt(v) : v,
  ) as Transaction[];
};

const decodeTransaction = ({ topics, data, ...rest }: Transaction) => {
  return {
    topics: [topics[0], decodeAddress(topics[1]), decodeAddress(topics[2])],
    data,
    ...rest,
  } as Transaction;
};

export function useTransactions(opts: UseTransactionsOptions) {
  const { initialData = [], endpoint } = opts;
  const [txns, setTxns] = useState<Transaction[]>(initialData);

  useEffect(() => {
    const socket = new WebSocket(endpoint);
    socket.onmessage = (ev) => {
      setTxns((t) => [
        ...parseTransaction(ev.data).map((txn) => decodeTransaction(txn)),
        ...t,
      ]);
    };
    return () => socket.close();
  }, [endpoint]);

  return txns;
}
