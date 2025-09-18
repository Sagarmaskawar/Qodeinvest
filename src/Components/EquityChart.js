// src/components/EquityChart.js
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import { format } from "date-fns";

const formatX = (timestamp) => {
  if (!timestamp) return "";
  return format(new Date(timestamp), "yyyy-MM");
};

export default function EquityChart({ series }) {
  if (!series || series.length === 0) return null;
  // recharts prefers plain objects with primitive values
  const data = series.map((s) => ({
    date: s.date.getTime(),
    equity: s.equity,
    drawdown: s.drawdown,
  }));

  return (
    <div>
      <h3>Equity curve</h3>
      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        Live since {format(series[0].date, "yyyy-MM-dd")}
      </div>

      <div style={{ width: "100%", height: 360 }}>
        <ResponsiveContainer width="100%" height="70%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatX} />
            <YAxis />
            <Tooltip
              labelFormatter={(v) => format(new Date(v), "yyyy-MM-dd")}
            />
            <Line
              type="monotone"
              dataKey="equity"
              stroke="#16a34a"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>

        <div style={{ width: "100%", height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip
                formatter={(v) => `${v.toFixed(2)}%`}
                labelFormatter={(v) => format(new Date(v), "yyyy-MM-dd")}
              />
              <Area dataKey="drawdown" stroke="#ef4444" fill="#fecaca" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
