export function formatCurrency(value: number | null | undefined, currency = "EUR") {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: Number.isInteger(n) ? 0 : 2,
  }).format(n);
}

export function formatMoney(amount: number | null | undefined, currency = "EUR") {
  const n = typeof amount === "number" && Number.isFinite(amount) ? amount : 0;
  const locale = currency === "USD" ? "en-US" : currency === "RSD" ? "sr-RS" : "en-IE";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: Number.isInteger(n) ? 0 : 2,
    }).format(n);
  } catch {
    return `${n} ${currency}`;
  }
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toISOString().slice(0, 10);
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const date = formatDate(value);
  const hasTime = /[T ]\d{2}:\d{2}/.test(value) && !(d.getHours() === 0 && d.getMinutes() === 0);
  if (!hasTime) return date;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${date} ${hh}:${mm}`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function isToday(value: string | null | undefined) {
  return !!value && value.slice(0, 10) === todayISO();
}

export function isOverdue(value: string | null | undefined) {
  return !!value && value.slice(0, 10) < todayISO();
}

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
