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

const STORAGE_CONNECTORS = "lovable.connectors";

export default function ConnectorsPage() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_CONNECTORS);
        if (raw) setOn(JSON.parse(raw) as Record<string, boolean>);
      } catch {}
      setHydrated(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  function toggle(id: string) {
    setOn((s) => {
      const next = { ...s, [id]: !s[id] };
      try {
        localStorage.setItem(STORAGE_CONNECTORS, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 tracking-tight">
      <h1 className="text-[32px] font-medium text-charcoal">Connectors</h1>
      <p className="mt-2 text-[15px] text-dim-gray">
        Connect tools and data sources to your AI apps. Connections are saved on this device.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ITEMS.map((item) => {
          const active = Boolean(on[item.id]);
          return (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-linen-border bg-warm-sand px-4 py-4"
            >
              <div>
                <p className="text-[15px] font-medium text-charcoal">{item.name}</p>
                <p className="text-[13px] text-dim-gray">{item.desc}</p>
              </div              >
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-pressed={active}
                className={
                  "rounded-full px-3 py-1.5 text-[13px] transition-colors " +
                  (active
                    ? "bg-[rgba(0,0,0,0.88)] text-parchment"
                    : "border border-linen-border bg-parchment text-charcoal hover:border-stone")
                }
              >
                {active ? "Connected" : "Connect"}
              </button>
            </div>
          );
        })}
      </div>
      {hydrated && Object.values(on).every((v) => !v) ? (
        <p className="mt-6 text-[13px] text-dim-gray">
          Nothing connected yet — toggling a connector marks it as connected for this workspace.
        </p>
      ) : null}
    </div>
  );
}
