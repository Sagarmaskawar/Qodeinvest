// src/pages/PortfolioPage.js
import React, { useMemo, useState } from "react";
import useExcelNav from "../hooks/useExcelNav";
import { computeEquityAndDrawdown, buildYearMonthTable, trailingReturn } from "../utils/navUtils";
import EquityChart from "../Components/EquityChart";
import TrailingTable from "../Components/TrailingTable";
import './portfolio.css';

export default function Portfolio() {
  // change path to match the file in public/
  const { navData, loading, error } = useExcelNav("/React Assignment Historical NAV Report.xlsx");
  const [fromDate, setFromDate] = useState(""); // optional filter for chart
  const [toDate, setToDate] = useState("");

  // compute equity & drawdown
  const { series, maxDD } = useMemo(() => {
    if (!navData || navData.length === 0) return { series: [], maxDD: 0 };
    return computeEquityAndDrawdown(navData);
  }, [navData]);

  // build year-month table
  const yearTable = useMemo(() => {
    if (!navData || navData.length === 0) return [];
    return buildYearMonthTable(navData);
  }, [navData]);

  // trailing returns (for this single dataset; if you have benchmark pass one more row)
  const trailingRows = useMemo(() => {
    if (!navData || navData.length === 0) return [];
    // helper to build single row (name param)
    function mkRow(name) {
      const last = navData[navData.length - 1];
      const r1d = trailingReturn(navData, { type: "days", value: 1 }, false);
      const r1w = trailingReturn(navData, { type: "days", value: 7 }, false);
      const r1m = trailingReturn(navData, { type: "months", value: 1 }, false);
      const r3m = trailingReturn(navData, { type: "months", value: 3 }, false);
      const r6m = trailingReturn(navData, { type: "months", value: 6 }, false);
      const r1y = trailingReturn(navData, { type: "years", value: 1 }, true);
      const r3y = trailingReturn(navData, { type: "years", value: 3 }, true);
      const si = trailingReturn(navData, { type: "si" }, true);
      const ytd = trailingReturn(navData, { type: "ytd" }, false);

      return {
        name,
        YTD: ytd?.pct ?? null,
        "1D": r1d?.pct ?? null,
        "1W": r1w?.pct ?? null,
        "1M": r1m?.pct ?? null,
        "3M": r3m?.pct ?? null,
        "6M": r6m?.pct ?? null,
        "1Y": r1y?.pct ?? null,
        "3Y": r3y?.pct ?? null,
        SI: si?.pct ?? null,
        DD: series.length ? series[series.length - 1].drawdown : null,
        MAXDD: maxDD,
      };
    }
    // If you'd like to show both portfolio + benchmark, compute second row similarly.
    return [mkRow("Portfolio")];
  }, [navData, series, maxDD]);

  if (loading) return <div>Loading NAV...</div>;
  if (error) return <div>Error reading file: {String(error)}</div>;
  if (!navData || navData.length === 0) return <div>No NAV data found</div>;

  // Optional: filter series by from/to date if set
  const filteredSeries = series.filter((s) => {
    if (fromDate && s.date < new Date(fromDate)) return false;
    if (toDate && s.date > new Date(toDate)) return false;
    return true;
  });

  return (
    <div className="portfolio-container">
      <TrailingTable trailingRows={trailingRows} />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
        <label>
          From date
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </label>
        <label>
          To date
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </label>
      </div>

      <div style={{ marginTop: 12 }}>
        <EquityChart series={filteredSeries.length ? filteredSeries : series} />
      </div>

      <div style={{ marginTop: 18 }}>
        <h4>Monthly Returns (by Year)</h4>
        <div style={{ marginTop: 8 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", padding: 12 }}>
            <thead>
              <tr style={{ color: "#6b7280" }}>
                <th style={{ textAlign: "left", padding: 8 }}>Year</th>
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Total"].map((m) => (
                  <th key={m} style={{ padding: 8 }}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {yearTable.map((r) => (
                <tr key={r.Year} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>{r.Year}</td>
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((mn) => (
                    <td key={mn} style={{ padding: 8, color: r[mn] < 0 ? "#ef4444" : "#16a34a" }}>
                      {r[mn] == null ? "-" : r[mn].toFixed(2) + "%"}
                    </td>
                  ))}
                  <td style={{ padding: 8, fontWeight: "bold" }}>{r.Total == null ? "-" : r.Total.toFixed(2) + "%"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
