"use client";
import { Treemap, Tooltip, ResponsiveContainer } from "recharts";

type StablecoinTreemapProps = {
  data: {
    symbol: string;
    id: number;
    name: string;
    market_cap: number;
    market_cap_dominance: number;
    fully_diluted_market_cap: number;
    volume_24h: number;
    percent_change_24h: number;
    quote_currency: string;
  }[];
};

const StablecoinTreemap: React.FC<StablecoinTreemapProps> = ({ data }) => {
  const formattedData = [
    {
      name: "",
      children: data
        .sort((a, b) => b.market_cap - a.market_cap)
        .map((coin) => ({
          name: coin.symbol,
          size: (Math.sqrt(coin.market_cap) * 2) / 3,
        })),
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={600}>
      <Treemap
        data={formattedData}
        dataKey="size"
        nameKey="name"
        stroke="black"
        fill="#00ffcc50"
        aspectRatio={1}
        isAnimationActive={false}
      >
        <Tooltip
          formatter={(value: number) => `$${(value * value).toLocaleString()}`}
        />
      </Treemap>
    </ResponsiveContainer>
  );
};

export default StablecoinTreemap;
