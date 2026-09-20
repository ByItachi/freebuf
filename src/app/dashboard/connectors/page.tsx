"use client";

import { useEffect, useState } from "react";

const ITEMS = [
  { id: "github", name: "GitHub", desc: "Import repos and sync commits" },
  { id: "supabase", name: "Supabase", desc: "Auth, database, and storage" },
  { id: "stripe", name: "Stripe", desc: "Payments and subscriptions" },
  { id: "notion", name: "Notion", desc: "Docs and knowledge sync" },
  { id: "slack", name: "Slack", desc: "Notifications and commands" },
  { id: "figma", name: "Figma", desc: "Design tokens and assets" },
];

type ServerState = { id: string; enabled: boolean; connected: boolean };

export default function ConnectorsPage() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  // Server-backed state: connected flags live in .data/admin.json and are
  // managed workspace-wide (also editable from /admin/connectors).
  useEffect(() => {
    let alive = true;
    fetch("/api/connectors", { cache: "no-store" })
      .then((r) => r.json() as Promise<{ connectors: ServerState[] }>)
      .then((d) => {
        if (!alive) return;
        const next: Record<string, boolean> = {};
        const en: Record<string, boolean> = {};
        for (const c of d.connectors) {
          next[c.id] = c.connected;
          en[c.id] = c.enabled;
        }
        setOn(next);
        setEnabled(en);
        setLoaded(true);
      })
      .catch(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  function toggle(id: string) {
    // Optimistic update, then persist to the server.
    setOn((s) => {
      const next = { ...s, [id]: !s[id] };
      void fetch("/api/admin/connectors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, connected: next[id] }),
      });
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 tracking-tight">
      <h1 className="text-[32px] font-medium text-charcoal">Connectors</h1>
      <p className="mt-2 text-[15px] text-dim-gray">
        Connect tools and data sources to your AI apps. Connections are saved for the whole
        workspace.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ITEMS.map((item) => {
          const active = Boolean(on[item.id]);
          const isEnabled = enabled[item.id] !== false;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-linen-border bg-warm-sand px-4 py-4"
            >
              <div>
                <p className="text-[15px] font-medium text-charcoal">{item.name}</p>
                <p className="text-[13px] text-dim-gray">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                disabled={!isEnabled}
                aria-pressed={active}
                className={
                  "rounded-full px-3 py-1.5 text-[13px] transition-colors " +
                  (active
                    ? "bg-[rgba(0,0,0,0.88)] text-parchment"
                    : "border border-linen-border bg-parchment text-charcoal hover:border-stone") +
                  (!isEnabled ? " cursor-not-allowed opacity-40" : "")
                }
              >
                {active ? "Connected" : "Connect"}
              </button>
            </div>
          );
        })}
      </div>
      {loaded && Object.values(on).every((v) => !v) ? (
        <p className="mt-6 text-[13px] text-dim-gray">
          Nothing connected yet — toggling a connector marks it as connected for this workspace.
        </p>
      ) : null}
    </div>
  );
}
