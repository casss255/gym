/* ---------- Weekly check-ins: weight and waist over time ----------
   Pure functions only: no DOM, no app state. Dates are 'YYYY-MM-DD' strings in the phone's local time. */
const CHECKIN_LIMITS = { w: [20, 300], waist: [40, 200] };
const CHECKIN_EVERY_DAYS = 7;
const DAY_MS = 86400000;
const CHART_HEADROOM = 0.15; // space above and below the data, as a share of its range
const CHART_MIN_HEADROOM = 0.5; // so a flat line still has some height

const pad2 = n => String(n).padStart(2, '0');
const round1 = n => Math.round(n * 10) / 10;

function todayStr(now = new Date()) {
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}
/* Noon avoids daylight-saving edges when adding whole days. */
const dateMs = ymd => {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d, 12).getTime();
};
const isDateStr = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && todayStr(new Date(dateMs(s))) === s;
const daysBetween = (a, b) => Math.round((dateMs(b) - dateMs(a)) / DAY_MS);
const addDays = (ymd, n) => todayStr(new Date(dateMs(ymd) + n * DAY_MS));

/* Returns an error key, or null when the check-in is usable. */
function validateCheckin(c, today) {
  if (!isDateStr(c.date) || c.date > today) return 'pe_date';
  if (!(c.w >= CHECKIN_LIMITS.w[0] && c.w <= CHECKIN_LIMITS.w[1])) return 'pe_w';
  if (!(c.waist >= CHECKIN_LIMITS.waist[0] && c.waist <= CHECKIN_LIMITS.waist[1])) return 'pe_waist';
  return null;
}

/* New sorted list with the check-in added, replacing any entry for the same date. */
const upsertCheckin = (entries, c) =>
  [...entries.filter(e => e.date !== c.date), { date: c.date, w: c.w, waist: c.waist }].sort((a, b) => (a.date < b.date ? -1 : 1));

const removeCheckin = (entries, date) => entries.filter(e => e.date !== date);

/* Is the next weekly check-in due? entries must be sorted oldest to newest. */
function weekStatus(entries, today) {
  if (!entries.length) return { due: true, daysSince: null, nextDate: today, count: 0 };
  const last = entries[entries.length - 1];
  const daysSince = daysBetween(last.date, today);
  return { due: daysSince >= CHECKIN_EVERY_DAYS, daysSince, nextDate: addDays(last.date, CHECKIN_EVERY_DAYS), count: entries.length };
}

/* Start, latest and change since the first check-in for one measure ('w' or 'waist'). */
function summarize(entries, key) {
  if (!entries.length) return null;
  const values = entries.map(e => e[key]);
  const first = values[0], last = values[values.length - 1];
  return {
    first, last, change: round1(last - first), pct: first ? ((last - first) / first) * 100 : 0,
    count: entries.length, min: Math.min(...values), max: Math.max(...values),
  };
}

/* Everything needed to draw one line chart from the first check-in to the newest.
   x follows real time; y is scaled to the data with a little headroom. box is { w, h, left, right, top, bottom }. */
function chartModel(entries, key, box) {
  const values = entries.map(e => e[key]);
  const lo = Math.min(...values), hi = Math.max(...values);
  const headroom = Math.max((hi - lo) * CHART_HEADROOM, CHART_MIN_HEADROOM);
  const yMin = lo - headroom, yMax = hi + headroom;
  const plotW = box.w - box.left - box.right, plotH = box.h - box.top - box.bottom;
  const t0 = dateMs(entries[0].date), t1 = dateMs(entries[entries.length - 1].date);
  const xAt = date => (t1 === t0 ? box.left + plotW / 2 : box.left + ((dateMs(date) - t0) / (t1 - t0)) * plotW);
  const yAt = v => box.top + (1 - (v - yMin) / (yMax - yMin)) * plotH;
  return {
    points: entries.map(e => ({ x: xAt(e.date), y: yAt(e[key]), value: e[key], date: e.date })),
    ticks: [yMax, (yMin + yMax) / 2, yMin].map(v => ({ value: v, y: yAt(v) })),
    baselineY: yAt(values[0]),
    yMin, yMax,
    plot: { x0: box.left, x1: box.left + plotW, y0: box.top, y1: box.top + plotH },
  };
}
