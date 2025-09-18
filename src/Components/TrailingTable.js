// src/components/TrailingTable.js
import React from "react";

const mkCell = (v) => {
  if (v == null || isNaN(v)) return "-";
  const cls = v < 0 ? { color: "#ef4444" } : { color: "#16a34a" };
  return <span style={cls}>{v.toFixed(2)}%</span>;
};

export default function TrailingTable({ trailingRows }) {
  if (!trailingRows || trailingRows.length === 0) return null;
  // trailingRows is expected like [{ name: "Focused", YTD: -1.7, "1D":0.1, ...}, {...}]
  const cols = ["NAME", "YTD", "1D", "1W", "1M", "3M", "6M", "1Y", "3Y", "SI", "DD", "MAXDD"];
  return (
    <div >
      <h3 style={{ marginBottom: 12 }}>Trailing Returns</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c} style={{ textAlign: "left", padding: "8px 10px", color: "#6b7280" }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trailingRows.map((r, i) => (
            <tr key={i} style={{ borderTop: "1px solid #eee" }}>
              <td style={{ padding: "10px" }}>{r.name}</td>
              <td style={{ padding: "10px" }}>{mkCell(r.YTD)}</td>
              <td style={{ padding: "10px" }}>{mkCell(r["1D"])}</td>
              <td style={{ padding: "10px" }}>{mkCell(r["1W"])}</td>
              <td style={{ padding: "10px" }}>{mkCell(r["1M"])}</td>
              <td style={{ padding: "10px" }}>{mkCell(r["3M"])}</td>
              <td style={{ padding: "10px" }}>{mkCell(r["6M"])}</td>
              <td style={{ padding: "10px" }}>{mkCell(r["1Y"])}</td>
              <td style={{ padding: "10px" }}>{mkCell(r["3Y"])}</td>
              <td style={{ padding: "10px" }}>{mkCell(r["SI"])}</td>
              <td style={{ padding: "10px" }}>{mkCell(r["DD"])}</td>
              <td style={{ padding: "10px" }}>{mkCell(r["MAXDD"])}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ color: "#6b7280", marginTop: 8, fontSize: 12 }}>
        Note: Returns above 1 year are annualised.
      </div>
    </div>
  );
}
