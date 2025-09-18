// src/utils/navUtils.js
import { differenceInCalendarDays, format } from "date-fns";

/** format date for x-axis */
export const fmt = (d) => {
  if (!d) return "";
  return format(d, "yyyy-MM-dd");
};

/** compute daily returns series (percent) from navData */
export function computeDailyReturns(navData) {
  const daily = [];
  for (let i = 1; i < navData.length; i++) {
    const prev = navData[i - 1];
    const cur = navData[i];
    const pct = (cur.nav / prev.nav - 1) * 100;
    daily.push({ date: cur.date, nav: cur.nav, pct });
  }
  return daily;
}

/** get the last NAV of each month (key = YYYY-MM) */
export function monthlyLast(navData) {
  const map = new Map();
  navData.forEach((row) => {
    const key = `${row.date.getFullYear()}-${String(row.date.getMonth() + 1).padStart(2, "0")}`;
    // we want the *last* day of month -> always overwrite so final value is last encountered
    map.set(key, { ...row });
  });
  // return sorted array
  return Array.from(map.entries())
    .map(([k, v]) => ({ ym: k, date: v.date, nav: v.nav }))
    .sort((a, b) => a.date - b.date);
}

/** build year-month table: returns array of objects { Year: 2023, Jan: x%, Feb: y%, ..., Total: z% } */
export function buildYearMonthTable(navData) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthly = monthlyLast(navData);
  // compute month-to-month returns using monthly list
  const monthReturns = [];
  for (let i = 1; i < monthly.length; i++) {
    const prev = monthly[i - 1];
    const cur = monthly[i];
    const pct = (cur.nav / prev.nav - 1) * 100;
    monthReturns.push({ year: cur.date.getFullYear(), monthIdx: cur.date.getMonth(), pct });
  }

  // collect per year
  const byYear = {};
  // initialize years that appear in monthly (use monthly array)
  monthly.forEach((m) => {
    const y = m.date.getFullYear();
    if (!byYear[y]) {
      byYear[y] = { Year: y };
      months.forEach((mn) => (byYear[y][mn] = null));
    }
  });

  monthReturns.forEach(({ year, monthIdx, pct }) => {
    byYear[year][months[monthIdx]] = Number(pct.toFixed(2));
  });

  // compute Total per year = (last NAV of year / first NAV of year -1) *100
  const monthlyByYear = {};
  monthly.forEach((m) => {
    const y = m.date.getFullYear();
    if (!monthlyByYear[y]) monthlyByYear[y] = [];
    monthlyByYear[y].push(m);
  });
  Object.keys(monthlyByYear).forEach((y) => {
    const arr = monthlyByYear[y];
    if (arr.length >= 1) {
      const total = (arr[arr.length - 1].nav / arr[0].nav - 1) * 100;
      byYear[y].Total = Number(total.toFixed(2));
    } else {
      byYear[y].Total = null;
    }
  });

  // output array sorted descending by year (so latest appears first)
  return Object.values(byYear).sort((a, b) => b.Year - a.Year);
}

/** Find closest index whose date is <= targetDate (binary search or linear) */
function findIndexBefore(navData, targetDate) {
  // assume navData sorted ascending
  for (let i = navData.length - 1; i >= 0; i--) {
    if (navData[i].date <= targetDate) return i;
  }
  return 0;
}

/** trailing return helper
 * period: object, e.g. { type: 'days', value: 1 } or type:'ytd' or type:'si'
 */
export function trailingReturn(navData, period, asAnnualized = true) {
  if (!navData || navData.length === 0) return null;
  const last = navData[navData.length - 1];
  const endDate = last.date;
  let startIndex = 0;

  if (period.type === "days") {
    const days = period.value;
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);
    startIndex = findIndexBefore(navData, startDate);
  } else if (period.type === "ytd") {
    const startDate = new Date(endDate.getFullYear(), 0, 1);
    startIndex = findIndexBefore(navData, startDate);
  } else if (period.type === "si") {
    startIndex = 0;
  } else if (period.type === "years") {
    const startDate = new Date(endDate);
    startDate.setFullYear(startDate.getFullYear() - period.value);
    startIndex = findIndexBefore(navData, startDate);
  } else if (period.type === "months") {
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - period.value);
    startIndex = findIndexBefore(navData, startDate);
  }

  const start = navData[Math.max(0, startIndex)];
  if (!start) return null;
  const totalReturn = last.nav / start.nav - 1;
  const days = differenceInCalendarDays(endDate, start.date) || 1;

  if (asAnnualized && days >= 365) {
    const years = days / 365;
    const annualized = Math.pow(1 + totalReturn, 1 / years) - 1;
    return { pct: annualized * 100, days };
  }
  return { pct: totalReturn * 100, days };
}

/** compute equity curve (normalize first NAV to 100) and drawdown series */
export function computeEquityAndDrawdown(navData) {
  if (!navData || navData.length === 0) return [];
  const firstNav = navData[0].nav;
  let peak = -Infinity;
  let maxDD = 0;
  const out = navData.map((r) => {
    const equity = (r.nav / firstNav) * 100;
    peak = Math.max(peak, equity);
    const dd = ((equity / peak - 1) * 100); // negative or 0
    maxDD = Math.min(maxDD, dd); // min since dd negative -> more negative is worse
    return {
      date: r.date,
      equity: Number(equity.toFixed(4)),
      drawdown: Number(dd.toFixed(4)), // negative numbers
      nav: r.nav,
    };
  });
  return { series: out, maxDD: Number(maxDD.toFixed(4)) };
}
