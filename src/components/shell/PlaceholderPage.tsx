import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export function PlaceholderPage({
  title,
  icon,
  phase,
  description,
}: {
  title: string;
  icon: LucideIcon;
  phase: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-300">
      <h1 className="mb-4 font-display text-[22px] font-extrabold tracking-[-0.5px] text-ink">
        {title}
      </h1>
      <div className="rounded-card border border-line bg-surface">
        <EmptyState
          icon={icon}
          title={`Coming in ${phase}`}
          description={description}
        />
      </div>
    </div>
  );
}
