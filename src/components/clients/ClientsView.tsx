"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Users, Pencil } from "lucide-react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonClasses } from "@/components/ui/Button";
import { formatDate } from "@/lib/format";
import type { Client } from "@/lib/types";
import type { ClientWithCount } from "@/lib/data/clients";
import { ClientForm } from "./ClientForm";

export type ClientsPanel = { mode: "new" } | { mode: "edit"; client: Client } | null;

export function ClientsView({
  clients,
  panel,
}: {
  clients: ClientWithCount[];
  panel: ClientsPanel;
}) {
  const router = useRouter();
  const close = () => router.push("/clients");

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-[22px] font-extrabold tracking-[-0.5px] text-ink">
          Clients
        </h1>
        <Link href="/clients?new=1" className={buttonClasses("primary")}>
          <Plus className="h-4 w-4" />
          New client
        </Link>
      </div>

      <Panel>
        {clients.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No clients yet"
            description="Add your first client to start tracking projects and invoices."
            action={
              <Link href="/clients?new=1" className={buttonClasses("primary")}>
                New client
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr>
                  <th className="border-b border-line-soft px-4 py-[11px] text-left text-[10.5px] font-bold uppercase tracking-[0.07em] text-muted">
                    Name
                  </th>
                  <th className="border-b border-line-soft px-4 py-[11px] text-left text-[10.5px] font-bold uppercase tracking-[0.07em] text-muted">
                    Contact
                  </th>
                  <th className="border-b border-line-soft px-4 py-[11px] text-right text-[10.5px] font-bold uppercase tracking-[0.07em] text-muted">
                    Projects
                  </th>
                  <th className="border-b border-line-soft px-4 py-[11px] text-right text-[10.5px] font-bold uppercase tracking-[0.07em] text-muted">
                    Added
                  </th>
                  <th className="border-b border-line-soft px-4 py-[11px]" />
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="group transition-colors hover:bg-white/[0.02]">
                    <td className="border-b border-line-soft px-4 py-3 font-semibold text-ink">
                      <Link href={`/clients/${c.id}`} className="hover:text-gold-hi">
                        {c.name}
                      </Link>
                    </td>
                    <td className="border-b border-line-soft px-4 py-3 text-muted">
                      {c.contact ?? "—"}
                    </td>
                    <td className="mono border-b border-line-soft px-4 py-3 text-right text-muted">
                      {c.projects?.[0]?.count ?? 0}
                    </td>
                    <td className="mono border-b border-line-soft px-4 py-3 text-right text-muted">
                      {formatDate(c.created_at)}
                    </td>
                    <td className="border-b border-line-soft px-4 py-3 text-right">
                      <Link
                        href={`/clients?edit=${c.id}`}
                        aria-label={`Edit ${c.name}`}
                        className="inline-flex rounded-ctrl p-1.5 text-faint opacity-0 transition-opacity hover:bg-white/[0.05] hover:text-ink group-hover:opacity-100"
                      >
                        <Pencil className="h-[15px] w-[15px]" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <SlideOver
        open={panel !== null}
        onClose={close}
        title={panel?.mode === "edit" ? "Edit client" : "New client"}
      >
        {panel?.mode === "edit" ? <ClientForm client={panel.client} /> : <ClientForm />}
      </SlideOver>
    </div>
  );
}
