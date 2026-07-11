export function Kpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-line bg-surface p-[15px]">
      <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-muted">
        {label}
      </div>
      <div className="mono mt-2 text-[24px] font-semibold tracking-[-0.5px] text-ink">{value}</div>
      {hint && <div className="mt-[5px] text-[11.5px] font-semibold text-muted">{hint}</div>}
    </div>
  );
}
