"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: { date: string; unitsUsed: number }[];
};

export default function UsageChart({ data }: Props) {
  return (
    <div className="bg-card p-6 rounded-2xl border border-gray-700 col-span-1 md:col-span-3">
      <h2 className="text-gray-400 text-sm mb-4">
        Usage Trend
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip />
          <Line 
            type="monotone"
            dataKey="unitsUsed"
            stroke="#FACC15"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}