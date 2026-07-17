"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { toggleTask } from "@/app/(app)/tasks/actions";
import { cn } from "@/lib/utils";

export function TaskCheckbox({ id, done }: { id: string; done: boolean }) {
  const router = useRouter();
  const [checked, setChecked] = useState(done);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    const next = !checked;
    setChecked(next); // optimistic
    startTransition(async () => {
      await toggleTask(id, next);
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={checked ? "Mark as not done" : "Mark as done"}
      onClick={toggle}
      disabled={pending}
      className={cn(
        "flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-[6px] border transition-colors disabled:cursor-not-allowed",
        checked
          ? "border-ok bg-ok/20 text-ok"
          : "border-line text-transparent hover:border-muted",
      )}
    >
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </button>
  );
}
