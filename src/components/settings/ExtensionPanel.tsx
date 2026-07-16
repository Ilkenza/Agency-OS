"use client";

import { useState, useTransition } from "react";
import { KeyRound, Copy, Check } from "lucide-react";
import { generateExtToken } from "@/app/(app)/settings/actions";
import { Button } from "@/components/ui/Button";

export function ExtensionPanel({
  token,
  url,
  anonKey,
}: {
  token: string | null;
  url: string;
  anonKey: string;
}) {
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = () =>
    startTransition(async () => {
      setError(null);
      const res = await generateExtToken();
      if (res?.error) setError(res.error);
    });

  const copyConfig = async () => {
    const config = JSON.stringify({ url, anonKey, token }, null, 2);
    try {
      await navigator.clipboard.writeText(config);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setError("Copy failed.");
    }
  };

  return (
    <div className="space-y-4 px-4 py-4">
      <p className="text-[13px] leading-relaxed text-muted">
        Connect the <b className="text-ink">Lead Collector</b> extension to your account: generate a
        token, click “Copy config”, then paste it into the extension (Options). The token is a secret —
        keep it safe; regenerating revokes the old one instantly.
      </p>

      {token ? (
        <div className="space-y-3">
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-muted">
              Token
            </div>
            <code className="mono block break-all rounded-ctrl border border-line bg-white/[0.03] px-3 py-2 text-[12px] text-ink">
              {token}
            </code>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="primary" onClick={copyConfig}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy config for the extension"}
            </Button>
            <Button type="button" variant="secondary" onClick={generate} disabled={pending}>
              <KeyRound className="h-4 w-4" />
              {pending ? "…" : "Regenerate token"}
            </Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="primary" onClick={generate} disabled={pending}>
          <KeyRound className="h-4 w-4" />
          {pending ? "Generating…" : "Generate token"}
        </Button>
      )}

      {error && <p className="text-[12px] text-danger">{error}</p>}
    </div>
  );
}
