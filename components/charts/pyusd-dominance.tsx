"use client";

import { Treemap } from "@visx/hierarchy";
import { scaleLinear } from "@visx/scale";
import { hierarchy } from "d3-hierarchy";

interface CoinData {
  symbol: string;
  id: number;
  name: string;
  market_cap: number;
  market_cap_dominance: number;
  fully_diluted_market_cap: number;
  volume_24h: number;
  percent_change_24h: number;
  quote_currency: string;
}

interface PyusdDominanceProps {
  data: CoinData[];
}

const width = 800;
const height = 400;

const colorScale = scaleLinear<string>({
  domain: [0, 100],
  range: ["#d0f0fd", "#007bff"],
});

const PyusdDominance: React.FC<PyusdDominanceProps> = ({ data }) => {
  if (!data || data.length === 0) return <p>No data available</p>;

  const formattedData = {
    name: "root",
    children: data.map((coin) => ({
      ...coin,
      name: coin.symbol, // Ensure name exists
    })),
  };

  const root = hierarchy(formattedData)
    .sum((d) => (d as CoinData).market_cap_dominance || 0)
    .sort((a, b) => (b.value || 0) - (a.value || 0));

  return (
    <svg width={width} height={height}>
      <Treemap root={root} size={[width, height]} tile="treemapSquarify">
        {(nodes) =>
          nodes.descendants().map((node, i) => {
            if (!node.x0 || !node.x1 || !node.y0 || !node.y1 || !node.data)
              return null;
            const { x0, x1, y0, y1 } = node;
            const value = node.value || 0;
            const coin = node.data as CoinData;

            return (
              <g key={i} transform={`translate(${x0}, ${y0})`}>
                <rect
                  width={x1 - x0}
                  height={y1 - y0}
                  fill={colorScale(value)}
                  stroke="#fff"
                />
                {x1 - x0 > 20 && y1 - y0 > 20 && (
                  <text
                    x={(x1 - x0) / 2}
                    y={(y1 - y0) / 2}
                    textAnchor="middle"
                    fill="black"
                    fontSize={12}
                    dy=".35em"
                  >
                    {coin.symbol}
                  </text>
                )}
              </g>
            );
          })
        }
      </Treemap>
    </svg>
  );
};

export default PyusdDominance;
