import { pyusd } from "@/lib/coinmarketcap";
import ethereum from "@/lib/ethereum";
import { formatGwei } from "viem";
import { FMono } from "./text";

export const Quote = async () => {
  const result = await pyusd.getQuote();
  if (!result.success) return "";

  const token = result.data.PYUSD[0];
  const price = token.quote.USD.price.toFixed(2);
  const change = token.quote.USD.percent_change_1h;

  return (
    <span>
      <FMono>{price}</FMono> USD{" "}
      <span
        className={change > 0 ? "text-success" : "text-danger"}
      >{`${change > 0 ? "+" : ""}${change.toFixed(2)}%`}</span>
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
