// src/hooks/useExcelNav.js
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

/**
 * Reads an Excel file from public/ and returns parsed sorted rows:
 * [{ date: Date, nav: Number }, ...] sorted ascending by date
 */
export default function useExcelNav(fileUrl) {
  const [navData, setNavData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(fileUrl);
        const ab = await res.arrayBuffer();
        const wb = XLSX.read(ab, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        // read as array-of-rows for robust header detection
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

        // find the header row containing "NAV Date" or "NAV"
        const headerRowIndex = rows.findIndex((r) =>
          r.some(
            (c) =>
              typeof c === "string" &&
              (c.toLowerCase().includes("nav date") || c.toLowerCase().includes("nav"))
          )
        );

        const dataRows = headerRowIndex >= 0 ? rows.slice(headerRowIndex + 1) : rows;
        // filter out rows with no meaningful first column
        const filtered = dataRows.filter((r) => r && r[0] != null && String(r[0]).trim() !== "");

        const parseDate = (cell) => {
          if (!cell && cell !== 0) return null;
          // if already a Date object
          if (cell instanceof Date) return cell;
          // common format dd-mm-yyyy or yyyy-mm-dd or mm/dd/yyyy
          const s = String(cell).trim();
          // handle Excel serial numbers? If looks numeric and not a date string, try Number -> Date
          if (!isNaN(Number(s)) && !s.includes("-") && !s.includes("/")) {
            const asNum = Number(s);
            // Excel serial likely not present as header: skip this complexity for now
          }
          // try yyyy-mm-dd
          if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(s)) {
            const [y, m, d] = s.split(/[-/]/).map(Number);
            return new Date(y, m - 1, d);
          }
          // try dd-mm-yyyy
          if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(s)) {
            const [d, m, y] = s.split(/[-/]/).map(Number);
            return new Date(y, m - 1, d);
          }
          // fallback: Date parse
          const d = new Date(s);
          return isNaN(d.getTime()) ? null : d;
        };

        const out = filtered
          .map((r) => {
            const date = parseDate(r[0]);
            // numeric value for NAV might contain commas
            const nav = r[1] == null ? null : Number(String(r[1]).replace(/,/g, ""));
            return date && nav != null ? { date, nav } : null;
          })
          .filter(Boolean)
          .sort((a, b) => a.date - b.date); // oldest -> newest

        if (!cancelled) {
          setNavData(out);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      }
    }
    load();
    return () => (cancelled = true);
  }, [fileUrl]);

  return { navData, loading, error };
}
