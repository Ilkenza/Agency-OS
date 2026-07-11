import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  help?: string;
  error?: boolean;
}

export function Field({ label, help, error, className, id, ...props }: FieldProps) {
  const inputId = id ?? props.name;
  return (
    <div className={cn("mb-[13px]", className)}>
      <label htmlFor={inputId} className="mb-1.5 block text-xs font-semibold text-[#C6CAD6]">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "w-full rounded-ctrl border bg-white/[0.035] px-3 py-2.5 text-[13.5px] text-ink",
          "placeholder:text-faint focus:outline-none",
          error
            ? "border-danger focus:shadow-[0_0_0_3px_var(--color-danger-bg)]"
            : "border-line focus:border-gold focus:shadow-[0_0_0_3px_rgba(217,164,65,0.15)]",
        )}
        {...props}
      />
      {help && (
        <p className={cn("mt-[5px] text-[11.5px]", error ? "text-danger" : "text-muted")}>{help}</p>
      )}
    </div>
  );
}
