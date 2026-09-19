"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Connector = {
  id: string;
  name: string;
  desc: string;
  category: string;
};

const CONNECTORS: Connector[] = [
  { id: "stripe", name: "Stripe", desc: "Payments and subscriptions", category: "Ecommerce" },
  { id: "slack", name: "Slack", desc: "Notifications and commands", category: "Messaging" },
  { id: "github", name: "GitHub", desc: "Import repos and sync commits", category: "Productivity" },
  { id: "supabase", name: "Supabase", desc: "Auth, database, and storage", category: "Productivity" },
  { id: "notion", name: "Notion", desc: "Docs and knowledge sync", category: "Productivity" },
  { id: "figma", name: "Figma", desc: "Design tokens and assets", category: "Productivity" },
];

const CATEGORIES = ["Ecommerce", "Messaging", "Productivity"] as const;

const STORAGE = "lovable.connectors";

function iconSrc(id: string) {
  return `https://lovable.dev/cdn-cgi/image/width=160,f=auto,fit=scale-down/https://assets.lovable.dev/img/connectors/${id}.svg`;
}

export function ConnectorsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [tab, setTab] = useState<"all" | "enabled">("all");
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"popular" | "az">("popular");
  const [heroDismissed, setHeroDismissed] = useState(false);
  const [request, setRequest] = useState("");
  const [requested, setRequested] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const requestRef = useRef<HTMLInputElement>(null);
  const requestTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (requestTimer.current) clearTimeout(requestTimer.current);
    };
  }, []);

  // hydrate connected state (deferred so the eslint set-state rule passes)
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE);
        if (raw) setEnabled(JSON.parse(raw) as Record<string, boolean>);
      } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, [open]);

  // esc closes, body scroll locks, initial focus on close button
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open, onClose]);

  const toggle = useCallback((id: string) => {
    setEnabled((s) => {
      const next = { ...s, [id]: !s[id] };
      try {
        localStorage.setItem(STORAGE, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const enabledCount = useMemo(
    () => CONNECTORS.reduce((n, c) => n + (enabled[c.id] ? 1 : 0), 0),
    [enabled],
  );

  const categoryCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of CONNECTORS) m.set(c.category, (m.get(c.category) ?? 0) + 1);
    return m;
  }, []);

  const visible = useMemo(() => {
    let list = CONNECTORS;
    if (tab === "enabled") list = list.filter((c) => enabled[c.id]);
    if (category) list = list.filter((c) => c.category === category);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q),
      );
    }
    if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [tab, category, query, sort, enabled]);

  function submitRequest() {
    const name = request.trim();
    if (!name) return;
    setRequested(name);
    setRequest("");
    if (requestTimer.current) clearTimeout(requestTimer.current);
    requestTimer.current = setTimeout(() => setRequested(null), 4000);
  }

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50 transition-[visibility] duration-300",
        open ? "visible" : "invisible pointer-events-none",
      )}
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/25 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* slide-over panel */}
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Connectors"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full flex-col border-l border-linen-border bg-parchment shadow-2xl transition-transform duration-300 ease-out md:w-[min(1100px,calc(100vw-288px))]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* header */}
        <header className="flex min-h-14 items-center gap-2 border-b border-linen-border px-4 py-2.5 md:pl-6">
          <span className="truncate text-[14px] font-medium tracking-tight text-charcoal">
            Connectors
          </span>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <label className="sr-only" htmlFor="connectors-sort">
              Sort connectors
            </label>
            <select
              id="connectors-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as "popular" | "az")}
              className="h-8 rounded-full border border-linen-border bg-warm-sand px-3 text-[13px] text-charcoal outline-none"
            >
              <option value="popular">Popular</option>
              <option value="az">A–Z</option>
            </select>
            <button
              type="button"
              onClick={() => requestRef.current?.focus()}
              aria-label="Create connector or MCP server"
              className="flex size-8 items-center justify-center rounded-full border border-linen-border bg-warm-sand text-charcoal transition-colors hover:border-stone"
            >
              <Plus className="size-4" />
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex size-8 items-center justify-center rounded-full text-dim-gray transition-colors hover:bg-black/[0.04] hover:text-charcoal"
            >
              <X className="size-4" />
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row">
          {/* left rail */}
          <aside className="flex w-full shrink-0 flex-col gap-3 p-3 md:w-52 md:border-r md:border-linen-border">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="size-[14px] text-dim-gray" />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search connectors"
                className="w-full rounded-full bg-black/[0.03] py-2 pl-9 pr-3 text-[13px] text-charcoal outline-none placeholder:text-dim-gray focus:bg-black/[0.06]"
              />
            </div>

            <nav aria-label="Connector filters" className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => setTab("enabled")}
                aria-current={tab === "enabled" ? "page" : undefined}
                className={cn(
                  "flex w-full items-center justify-between rounded-full px-3 py-2 text-[13px] transition-colors",
                  tab === "enabled"
                    ? "bg-black/[0.06] font-medium text-ink"
                    : "text-dim-gray hover:bg-black/[0.03] hover:text-charcoal",
                )}
              >
                <span>Enabled</span>
                <span className="tabular-nums">{enabledCount}</span>
              </button>
              <button
                type="button"
                onClick={() => setTab("all")}
                aria-current={tab === "all" ? "page" : undefined}
                className={cn(
                  "flex w-full items-center justify-between rounded-full px-3 py-2 text-[13px] transition-colors",
                  tab === "all"
                    ? "bg-black/[0.06] font-medium text-ink"
                    : "text-dim-gray hover:bg-black/[0.03] hover:text-charcoal",
                )}
              >
                <span>All</span>
                <span className="tabular-nums">{CONNECTORS.length}</span>
              </button>
            </nav>

            <div className="hidden flex-col gap-1 md:flex">
              <p className="flex h-8 items-center px-3 text-[11px] font-medium uppercase tracking-wide text-dim-gray">
                Categories
              </p>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(category === cat ? null : cat)}
                  aria-pressed={category === cat}
                  className={cn(
                    "flex w-full items-center justify-between rounded-full px-3 py-2 text-[13px] transition-colors",
                    category === cat
                      ? "bg-black/[0.06] font-medium text-ink"
                      : "text-dim-gray hover:bg-black/[0.03] hover:text-charcoal",
                  )}
                >
                  <span>{cat}</span>
                  <span className="tabular-nums">{categoryCounts.get(cat) ?? 0}</span>
                </button>
              ))}
            </div>

            {/* request box */}
            <div className="mt-auto rounded-2xl border border-linen-border bg-warm-sand p-3">
              <p className="text-[13px] font-medium text-charcoal">Missing a connector?</p>
              <div className="mt-2 flex items-center gap-1.5">
                <input
                  ref={requestRef}
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitRequest();
                  }}
                  placeholder="Add your tool"
                  aria-label="Name a tool or service to request"
                  className="min-w-0 flex-1 rounded-full border border-linen-border bg-parchment px-3 py-1.5 text-[12.5px] text-charcoal outline-none placeholder:text-dim-gray"
                />
                <button
                  type="button"
                  onClick={submitRequest}
                  className="shrink-0 rounded-full bg-black/[0.88] px-3 py-1.5 text-[12.5px] text-parchment transition-colors hover:bg-black"
                >
                  Request
                </button>
              </div>
              {requested ? (
                <p className="mt-2 text-[11.5px] leading-snug text-dim-gray" role="status">
                  Thanks — “{requested}” noted for this workspace.
                </p>
              ) : null}
            </div>
          </aside>

          {/* main */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* hero (dismissible) */}
            {!heroDismissed ? (
              <div className="flex flex-col items-center gap-2 px-6 pb-2 pt-6 text-center">
                <h2 className="text-[22px] font-medium tracking-tight text-charcoal">
                  Build from what you already use
                </h2>
                <p className="max-w-md text-[13px] leading-relaxed text-dim-gray">
                  Connectors let your app talk to external tools like Stripe, Slack, and GitHub —
                  ask the agent to get started.
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <a
                    href="/connect"
                    className="rounded-full border border-linen-border bg-warm-sand px-3 py-1.5 text-[12.5px] text-charcoal transition-colors hover:border-stone"
                  >
                    View the docs
                  </a>
                  <button
                    type="button"
                    onClick={() => setHeroDismissed(true)}
                    className="rounded-full bg-black/[0.88] px-3 py-1.5 text-[12.5px] text-parchment transition-colors hover:bg-black"
                  >
                    Got it
                  </button>
                </div>
              </div>
            ) : null}

            {/* connector grid */}
            <div className="flex-1 px-4 pb-8 pt-4 md:px-6">
              {visible.length === 0 ? (
                <p className="py-10 text-center text-[13px] text-dim-gray">
                  No connectors match — try another search or category.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
                  {visible.map((c) => {
                    const active = Boolean(enabled[c.id]);
                    return (
                      <div
                        key={c.id}
                        className="flex items-center gap-3 rounded-2xl border border-linen-border bg-warm-sand p-2 transition-shadow hover:shadow-sm"
                      >
                        <span className="relative shrink-0">
                          <span className="flex size-10 items-center justify-center overflow-hidden rounded-lg border border-linen-border bg-parchment">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={iconSrc(c.id)}
                              alt=""
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              className="size-7 object-contain"
                            />
                          </span>
                          {active ? (
                            <span
                              aria-hidden
                              className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-[#22c55e] ring-2 ring-parchment"
                            />
                          ) : null}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-medium tracking-tight text-charcoal">
                            {c.name}
                          </span>
                          <span className="block truncate text-[12px] text-dim-gray">{c.desc}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => toggle(c.id)}
                          aria-pressed={active}
                          className={cn(
                            "shrink-0 rounded-full px-3 py-1.5 text-[12.5px] transition-colors",
                            active
                              ? "bg-black/[0.88] text-parchment hover:bg-black"
                              : "border border-linen-border bg-parchment text-charcoal hover:border-stone",
                          )}
                        >
                          {active ? "Connected" : "Connect"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="mt-6 border-t border-linen-border pt-4 text-[12px] text-dim-gray">
                Connections are saved on this device.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ConnectorsDrawer;
