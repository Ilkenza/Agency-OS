import { cn } from "@/lib/utils";

export type BadgeStatus = "ok" | "active" | "pending" | "danger" | "draft" | "info";

const variants: Record<BadgeStatus, string> = {
  ok: "text-ok bg-ok-bg before:bg-ok",
  active: "text-active bg-active-bg before:bg-active",
  pending: "text-pending bg-pending-bg before:bg-pending",
  danger: "text-danger bg-danger-bg before:bg-danger",
  draft: "text-draft bg-draft-bg before:bg-draft",
  info: "text-info bg-info-bg before:bg-info",
};

interface BadgeProps {
  status: BadgeStatus;
  children: React.ReactNode;
  className?: string;
}

/** One badge component, five status variants — the spine of the whole app. */
export function Badge({ status, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[11.5px] font-semibold whitespace-nowrap",
        "before:h-1.5 before:w-1.5 before:rounded-full before:content-['']",
        variants[status],
        className,
      )}
    >
      {children}
    </span>
  );
}
