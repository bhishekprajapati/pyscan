import { pyusd } from "@/lib/coinmarketcap";
import ethereum from "@/lib/ethereum";
import { formatGwei } from "viem";
import { FMono } from "./text";

const round = (n: number = 0) =>
  Math.trunc(n * Math.pow(10, 2)) / Math.pow(10, 2);

export const Quote = async () => {
  const result = await pyusd.getQuote();
  if (!result.success) return "";

  const token = result.data.PYUSD[0];
  const price = token.quote.USD.price;
  const change = token.quote.USD.percent_change_1h;

  return (
    <span>
      <FMono>{round(price)}</FMono> USD{" "}
      <span
        className={change > 0 ? "text-success" : "text-danger"}
      >{`${change > 0 ? "+" : ""}${round(change)}%`}</span>
    </span>
  );
};

export const EthGasFee = async () => {
  const result = await ethereum.mainnet.getGasPrice();
  if (!result.success) return "";
  const wei = result.data;
  return (
    <span>
      <FMono>{formatGwei(wei)}</FMono> Gwei
    </span>
  );
};
