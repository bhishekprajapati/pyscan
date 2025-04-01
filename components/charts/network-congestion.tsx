"use client";

import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";

interface CongestionData {
  hour: string;
  avg_gas_price: number;
  avg_block_utilization: number;
}

const NetworkCongestionChart = () => {
  const data = [
    { hour: "2025-03-29 19:01", avg_gas_price: 131, avg_block_utilization: 77 },
    { hour: "2025-03-29 20:01", avg_gas_price: 96, avg_block_utilization: 97 },
    { hour: "2025-03-29 21:01", avg_gas_price: 79, avg_block_utilization: 95 },
    { hour: "2025-03-29 22:01", avg_gas_price: 57, avg_block_utilization: 99 },
    { hour: "2025-03-29 23:01", avg_gas_price: 106, avg_block_utilization: 92 },
    { hour: "2025-03-30 00:01", avg_gas_price: 113, avg_block_utilization: 80 },
    { hour: "2025-03-30 01:01", avg_gas_price: 34, avg_block_utilization: 66 },
    { hour: "2025-03-30 02:01", avg_gas_price: 107, avg_block_utilization: 90 },
    { hour: "2025-03-30 03:01", avg_gas_price: 107, avg_block_utilization: 65 },
    { hour: "2025-03-30 04:01", avg_gas_price: 115, avg_block_utilization: 89 },
    { hour: "2025-03-30 05:01", avg_gas_price: 54, avg_block_utilization: 68 },
    { hour: "2025-03-30 06:01", avg_gas_price: 47, avg_block_utilization: 79 },
    { hour: "2025-03-30 07:01", avg_gas_price: 51, avg_block_utilization: 84 },
    { hour: "2025-03-30 08:01", avg_gas_price: 56, avg_block_utilization: 76 },
    { hour: "2025-03-30 09:01", avg_gas_price: 113, avg_block_utilization: 90 },
    { hour: "2025-03-30 10:01", avg_gas_price: 105, avg_block_utilization: 71 },
    { hour: "2025-03-30 11:01", avg_gas_price: 78, avg_block_utilization: 81 },
    { hour: "2025-03-30 12:01", avg_gas_price: 135, avg_block_utilization: 66 },
    { hour: "2025-03-30 13:01", avg_gas_price: 102, avg_block_utilization: 65 },
    { hour: "2025-03-30 14:01", avg_gas_price: 72, avg_block_utilization: 60 },
    { hour: "2025-03-30 15:01", avg_gas_price: 54, avg_block_utilization: 72 },
    { hour: "2025-03-30 16:01", avg_gas_price: 60, avg_block_utilization: 91 },
    { hour: "2025-03-30 17:01", avg_gas_price: 130, avg_block_utilization: 88 },
    { hour: "2025-03-30 18:01", avg_gas_price: 81, avg_block_utilization: 67 },
  ];

  return (
    <ResponsiveContainer width="100%" className="relative md:h-full">
      <LineChart data={data}>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const { hour, avg_gas_price } = payload[0].payload;
              return (
                <div className="rounded-md bg-gray-900 p-2 text-white shadow-md">
                  <p>{hour}</p>
                  <p>Gas Price: {avg_gas_price} Gwei</p>
                </div>
              );
            }
            return null;
          }}
        />
        {/* <Legend
          content={({ payload, onToggle }) => {
            console.log(payload);

            return (
              <div className="absolute bottom-0 right-0 rounded-md bg-default p-4">
                <span className="text-xs font-bold">Network Congestion</span>
                <br />
                <Button onPress={onToggle}>1</Button>
                <br />
                <Button>2</Button>
              </div>
            );
          }}
        /> */}
        <Line
          type="natural"
          dataKey="avg_gas_price"
          className="stroke-secondary"
          stroke="inherit"
          strokeWidth={1.5}
          dot={false}
          filter="url(#glow)"
        />
        <Line
          type="natural"
          dataKey="avg_block_utilization"
          className="stroke-primary"
          stroke="inherit"
          strokeWidth={1.5}
          dot={false}
          filter="url(#glow)"
        />
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default NetworkCongestionChart;
