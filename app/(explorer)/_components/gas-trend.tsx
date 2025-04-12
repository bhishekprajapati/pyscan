import { unstable_cacheLife as cacheLife } from "next/cache";
import { omit } from "remeda";

import bigquery from "@/lib/bigquery";
import GasTrend from "@/components/charts/gas-trend";
import { devOnly } from "@/utils/dev";

const getGasTrendDummyData = () => ({
  data: [
    {
      tx_date: "2025-04-01",
      network: {
        total_txns: 84500,
        avg_gas_price_gwei: 42.7,
        max_gas_price_gwei: 153.2,
        min_gas_price_gwei: 3.9,
      },
      pyusd: {
        total_txns: 2100,
        avg_gas_price_gwei: 38.5,
        max_gas_price_gwei: 122.4,
        min_gas_price_gwei: 4.1,
      },
    },
    {
      tx_date: "2025-04-02",
      network: {
        total_txns: 90230,
        avg_gas_price_gwei: 48.3,
        max_gas_price_gwei: 171.9,
        min_gas_price_gwei: 2.7,
      },
      pyusd: {
        total_txns: 1780,
        avg_gas_price_gwei: 41.6,
        max_gas_price_gwei: 140.3,
        min_gas_price_gwei: 3.4,
      },
    },
    {
      tx_date: "2025-04-03",
      network: {
        total_txns: 78800,
        avg_gas_price_gwei: 39.1,
        max_gas_price_gwei: 149.7,
        min_gas_price_gwei: 4.5,
      },
      pyusd: {
        total_txns: 1995,
        avg_gas_price_gwei: 35.8,
        max_gas_price_gwei: 110.9,
        min_gas_price_gwei: 2.1,
      },
    },
    {
      tx_date: "2025-04-04",
      network: {
        total_txns: 93510,
        avg_gas_price_gwei: 45.6,
        max_gas_price_gwei: 162.8,
        min_gas_price_gwei: 3.2,
      },
      pyusd: {
        total_txns: 2200,
        avg_gas_price_gwei: 43.2,
        max_gas_price_gwei: 137.6,
        min_gas_price_gwei: 3.9,
      },
    },
    {
      tx_date: "2025-04-05",
      network: {
        total_txns: 87640,
        avg_gas_price_gwei: 47.9,
        max_gas_price_gwei: 158.3,
        min_gas_price_gwei: 4.0,
      },
      pyusd: {
        total_txns: 2055,
        avg_gas_price_gwei: 39.7,
        max_gas_price_gwei: 129.2,
        min_gas_price_gwei: 2.5,
      },
    },
  ],
  timestamp: Date.now(),
});

const eth = bigquery.ethereum.mainnet;
const getCachedGasTrend = async () => {
  "use cache";
  cacheLife("gasTrend");

  const network = await eth.getNetworkGasTrend();
  if (!network.success) {
    throw Error(network.reason);
  }

  const pyusd = await eth.getPyusdGasTrend();
  if (!pyusd.success) {
    throw Error(pyusd.reason);
  }

  return {
    data: network.data
      .map(({ tx_date, ...networkGasRecord }) => {
        const pyusdGasRecord = pyusd.data.find(
          ({ tx_date: pyusd_tx_date }) => pyusd_tx_date.value === tx_date.value,
        );
        if (!pyusdGasRecord) return undefined;
        return {
          tx_date: tx_date.value,
          network: networkGasRecord,
          pyusd: omit(pyusdGasRecord, ["tx_date"]),
        };
      })
      .filter(Boolean),
    timestamp: Date.now(),
  };
};

const GasTrendChart = async () => {
  const fetcher = devOnly(getCachedGasTrend, getGasTrendDummyData);
  const data = await fetcher();
  // @ts-expect-error fix this
  return <GasTrend {...data} />;
};

export default GasTrendChart;
