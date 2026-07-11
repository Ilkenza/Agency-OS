/** EUR, no trailing .00 for whole amounts. Render inside a `.mono` element. */
export function formatCurrency(value: number | null | undefined, currency = "EUR") {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: Number.isInteger(n) ? 0 : 2,
  }).format(n);
}

/** ISO date `YYYY-MM-DD`, or an em dash when empty. */
export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toISOString().slice(0, 10);
}

/** Today's date as `YYYY-MM-DD` (server timezone). */
export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/** A `due_at` (date string) compared to today, ignoring time. */
export function isToday(value: string | null | undefined) {
  return !!value && value.slice(0, 10) === todayISO();
}

export function isOverdue(value: string | null | undefined) {
  return !!value && value.slice(0, 10) < todayISO();
}

/** Compact relative time: "just now", "5m", "3h", "2d", "3w"; older falls back to a date. */
export function formatRelativeTime(value: string | null | undefined) {
  if (!value) return "";
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "";
  const sec = Math.floor((Date.now() - then) / 1000);
  if (sec < 45) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d`;
  const wk = Math.floor(day / 7);
  if (wk < 5) return `${wk}w`;
  return formatDate(value);
}
