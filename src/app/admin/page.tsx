"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  ArrowLeft,
  BadgeDollarSign,
  Blocks,
  Calendar,
  ChevronDown,
  Clock,
  CreditCard,
  Loader2,
  LogOut,
  Plug,
  Plus,
  RefreshCw,
  Server,
  Settings,
  Settings2,
  Sparkles,
  ScrollText,
  Trash2,
  UserRound,
  Users,
  Activity,
  Download,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { FreebuffMark } from "@/components/brand";
import { useFormState } from "./use-form-state";
import type { AdminSnapshot } from "@/lib/admin-types";

const ADMIN_SIDEBAR_KEY = "freebuff.admin-sidebar-collapsed";

/** localStorage-backed collapsed state; SSR renders expanded, client syncs after hydration. */
const adminSidebarStore = {
  subscribe(onChange: () => void) {
    window.addEventListener("storage", onChange);
    window.addEventListener("freebuff:admin-sidebar", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("freebuff:admin-sidebar", onChange);
    };
  },
  getSnapshot(): boolean {
    try {
      return localStorage.getItem(ADMIN_SIDEBAR_KEY) === "1";
    } catch {
      return false;
    }
  },
  getServerSnapshot(): boolean {
    return false;
  },
  set(next: boolean) {
    try {
      localStorage.setItem(ADMIN_SIDEBAR_KEY, next ? "1" : "0");
    } catch {}
    window.dispatchEvent(new Event("freebuff:admin-sidebar"));
  },
};

type Tab =
  | "overview"
  | "members"
  | "projects"
  | "connectors"
  | "ai"
  | "billing"
  | "audit";

const NAV: { group: string; items: { id: Tab; label: string; icon: typeof Users }[] }[] = [
  {
    group: "Workspace",
    items: [
      { id: "overview", label: "General", icon: Server },
      { id: "projects", label: "Projects", icon: Blocks },
      { id: "members", label: "People", icon: Users },
    ],
  },
  {
    group: "Integrations",
    items: [
      { id: "connectors", label: "Connectors", icon: Plug },
      { id: "ai", label: "Cloud & AI balance", icon: Sparkles },
    ],
  },
  {
    group: "Billing & compliance",
    items: [
      { id: "billing", label: "Plans & credits", icon: BadgeDollarSign },
      { id: "audit", label: "Audit log", icon: ScrollText },
    ],
  },
];

export default function AdminPage() {
  // Deep-linkable tab: /admin?tab=members selects the People tab directly.
  const [tab, setTabState] = useState<Tab>(() => {
    if (typeof window === "undefined") return "overview";
    const t = new URLSearchParams(window.location.search).get("tab");
    const valid = NAV.flatMap((g) => g.items).some((i) => i.id === t);
    return valid ? (t as Tab) : "overview";
  });
  const setTab = useCallback((next: Tab) => {
    setTabState(next);
    try {
      const url = new URL(window.location.href);
      if (next === "overview") url.searchParams.delete("tab");
      else url.searchParams.set("tab", next);
      window.history.replaceState(null, "", url);
    } catch {}
  }, []);
  const [data, setData] = useState<AdminSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Collapsible sidebar: icon rail on desktop (persisted), slide-over drawer on mobile.
  const collapsed = useSyncExternalStore(
    adminSidebarStore.subscribe,
    adminSidebarStore.getSnapshot,
    adminSidebarStore.getServerSnapshot,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleCollapsed = useCallback(() => {
    adminSidebarStore.set(!adminSidebarStore.getSnapshot());
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      if (res.status === 401) {
        window.location.reload();
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData((await res.json()) as AdminSnapshot);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load lazily so we never call setState synchronously inside an effect.
  useEffect(() => {
    const t = setTimeout(() => void load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.href = "/dashboard";
  }

  return (
    <div className="flex min-h-screen bg-parchment">
      {/* ------------------------------ sidebar ------------------------------ */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-linen-border bg-parchment transition-[width] duration-200 md:flex ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Mark alone on top (reference layout) — becomes the expand button when collapsed. */}
        <div className="px-4 pb-3 pt-5">
          {collapsed ? (
            <button
              type="button"
              onClick={toggleCollapsed}
              className="flex size-6 items-center justify-center"
              aria-label="Kenar çubuğunu genişlet"
            >
              <FreebuffMark className="size-6 shrink-0" />
            </button>
          ) : (
            <FreebuffMark className="size-6 shrink-0" />
          )}
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-3 pb-3">
          {collapsed ? null : <LinkBack />}
          {NAV.map((group) => (
            <div key={group.group}>
              <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-wide text-dim-gray">
                {group.group}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    title={item.label}
                    className={`flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-[13.5px] tracking-tight transition-colors ${
                      tab === item.id
                        ? "bg-black/[0.06] font-medium text-ink"
                        : "text-dim-gray hover:bg-black/[0.03] hover:text-charcoal"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    <item.icon className="size-[15px] shrink-0 opacity-80" />
                    {collapsed ? null : <span className="truncate">{item.label}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-linen-border px-3 py-3">
          {collapsed ? (
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={toggleCollapsed}
                className="flex size-9 items-center justify-center rounded-full text-dim-gray transition-colors hover:bg-black/[0.03] hover:text-charcoal"
                aria-label="Kenar çubuğunu genişlet"
              >
                <PanelLeftOpen className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => void logout()}
                className="flex size-9 items-center justify-center rounded-full text-dim-gray transition-colors hover:bg-black/[0.03] hover:text-charcoal"
                aria-label="Panelden çık"
              >
                <LogOut className="size-4 opacity-80" />
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleCollapsed}
                className="flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-[13.5px] tracking-tight text-dim-gray transition-colors hover:bg-black/[0.03] hover:text-charcoal"
              >
                <PanelLeftClose className="size-[15px] opacity-80" /> Paneli gizle
              </button>
              <button
                type="button"
                onClick={() => void logout()}
                className="flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-[13.5px] tracking-tight text-dim-gray transition-colors hover:bg-black/[0.03] hover:text-charcoal"
              >
                <LogOut className="size-[15px] opacity-80" /> Panelden çık
              </button>
            </>
          )}
        </div>
      </aside>

      {/* --------------------------- mobile drawer --------------------------- */}
      {mobileOpen ? (
        <>
          <button
            type="button"
            aria-label="Menüyü kapat"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-linen-border bg-parchment md:hidden">
            <div className="flex items-center justify-between px-4 pb-3 pt-5">
              <FreebuffMark className="size-6 shrink-0" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-dim-gray hover:bg-black/[0.04] hover:text-charcoal"
                aria-label="Kapat"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-3 pb-3">
              <LinkBack />
              {NAV.map((group) => (
                <div key={group.group}>
                  <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-wide text-dim-gray">
                    {group.group}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setTab(item.id);
                          setMobileOpen(false);
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-[13.5px] tracking-tight transition-colors ${
                          tab === item.id
                            ? "bg-black/[0.06] font-medium text-ink"
                            : "text-dim-gray hover:bg-black/[0.03] hover:text-charcoal"
                        }`}
                      >
                        <item.icon className="size-[15px] shrink-0 opacity-80" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
            <div className="border-t border-linen-border px-3 py-3">
              <button
                type="button"
                onClick={() => void logout()}
                className="flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-[13.5px] tracking-tight text-dim-gray transition-colors hover:bg-black/[0.03] hover:text-charcoal"
              >
                <LogOut className="size-[15px] opacity-80" /> Panelden çık
              </button>
            </div>
          </aside>
        </>
      ) : null}

      {/* ------------------------------- main -------------------------------- */}
      <main className={`min-w-0 flex-1 transition-[margin] duration-200 ${collapsed ? "md:ml-16" : "md:ml-60"}`}>
        {/* Mobile nav: the sidebar is md+, so phones need their own tab bar */}
        <div className="sticky top-0 z-30 border-b border-linen-border bg-parchment/95 backdrop-blur md:hidden">
          <div className="flex items-center justify-between gap-2 px-4 pb-2 pt-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex size-8 items-center justify-center rounded-full text-dim-gray hover:bg-black/[0.04] hover:text-charcoal"
                aria-label="Menüyü aç"
              >
                <Menu className="size-4" />
              </button>
              <FreebuffMark className="size-5 shrink-0" />
              <span className="truncate text-[13px] font-medium tracking-tight text-charcoal">
                Refero Design
              </span>
            </div>
            <button
              type="button"
              onClick={() => void logout()}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] text-dim-gray transition-colors hover:bg-black/[0.04] hover:text-charcoal"
            >
              <LogOut className="size-3.5" /> Çıkış
            </button>
          </div>
          <div className="flex gap-1 overflow-x-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV.flatMap((g) => g.items).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-pressed={tab === item.id}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] tracking-tight transition-colors ${
                  tab === item.id
                    ? "bg-black/[0.06] font-medium text-ink"
                    : "text-dim-gray hover:bg-black/[0.03] hover:text-charcoal"
                }`}
              >
                <item.icon className="size-3.5 opacity-80" />
                {item.label}
              </button>
            ))}
            <a
              href="/dashboard"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] tracking-tight text-dim-gray transition-colors hover:bg-black/[0.03] hover:text-charcoal"
            >
              <ArrowLeft className="size-3.5 opacity-80" /> Panele dön
            </a>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-6 tracking-tight sm:px-6 md:py-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-[22px] font-medium text-charcoal">
                {NAV.flatMap((g) => g.items).find((i) => i.id === tab)?.label}
              </h1>
              <p className="mt-0.5 text-[13px] text-dim-gray">
                {tab === "overview"
                  ? "Workspace verileri ve sistem durumu."
                  : tab === "members"
                    ? "Çalışma alanına erişimi yönet — roller, krediler, davetler."
                    : tab === "projects"
                      ? "Tüm workspace projeleri ve içerik istatistikleri."
                      : tab === "connectors"
                        ? "Platform genelinde connector erişimini yönet."
                        : tab === "ai"
                          ? "AI sağlayıcıları, anahtarlar ve model limitleri."
                          : "Abonelik planı ve kredi bakiyesi yönetimi."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void load()}
              className="flex size-9 items-center justify-center rounded-full text-dim-gray transition-colors hover:bg-black/[0.04] hover:text-charcoal"
              aria-label="Yenile"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {error ? (
            <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error}
            </p>
          ) : null}

          {loading && !data ? (
            <div className="flex items-center gap-2 py-16 text-[13px] text-dim-gray">
              <Loader2 className="size-4 animate-spin" /> Yükleniyor…
            </div>
          ) : null}

          {data ? (
            <div className="mt-6">
              {tab === "overview" ? <Overview data={data} /> : null}
              {tab === "members" ? <Members data={data} reload={load} /> : null}
              {tab === "projects" ? <Projects data={data} /> : null}
              {tab === "connectors" ? <Connectors data={data} reload={load} /> : null}
              {tab === "ai" ? <AI data={data} reload={load} /> : null}
              {tab === "billing" ? <Billing data={data} reload={load} /> : null}
              {tab === "audit" ? <AuditLog data={data} reload={load} /> : null}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function LinkBack() {
  return (
    <a
      href="/dashboard"
      className="flex w-full items-center gap-2 rounded-full px-3 py-2 text-[13.5px] tracking-tight text-dim-gray transition-colors hover:bg-black/[0.03] hover:text-charcoal"
    >
      <ArrowLeft className="size-[15px] opacity-80" /> Panele dön
    </a>
  );
}

/* ------------------------------- overview ------------------------------ */

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-linen-border bg-warm-sand/60 p-4">
      <p className="text-[12px] uppercase tracking-wide text-dim-gray">{label}</p>
      <p className="mt-1 text-[24px] font-medium tracking-tight text-charcoal">{value}</p>
      {hint ? <p className="text-[12px] text-dim-gray">{hint}</p> : null}
    </div>
  );
}

function Overview({ data }: { data: AdminSnapshot }) {
  const o = data.overview;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Üyeler" value={String(o.members)} hint={`${o.activeMembers} aktif · ${o.suspendedMembers} askıda`} />
        <Stat label="Tahsil edilen" value={`$${o.paidRevenue}`} hint={`Açık fatura: $${o.openRevenue}`} />
        <Stat label="Projeler" value={String(data.projects.length)} hint={`${data.projects.reduce((s, p) => s + p.messageCount, 0)} mesaj`} />
        <Stat label="Connectorlar" value={`${o.connectedCount}/${o.enabledCount}`} hint="bağlı / açık" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-linen-border bg-warm-sand/60 p-4">
          <p className="text-[13px] font-medium text-charcoal">Son faturalar</p>
          <ul className="mt-2 divide-y divide-linen-border text-[13px]">
            {data.invoices.slice(0, 5).map((i) => (
              <li key={i.id} className="flex items-center justify-between py-2">
                <span className="text-charcoal/80">{i.number}</span>
                <span className={i.status === "paid" ? "text-emerald-600" : i.status === "open" ? "text-amber-600" : "text-dim-gray"}>
                  ${i.amount} · {i.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-linen-border bg-warm-sand/60 p-4">
          <p className="text-[13px] font-medium text-charcoal">Yeni üyeler</p>
          <ul className="mt-2 divide-y divide-linen-border text-[13px]">
            {[...data.members]
              .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
              .slice(0, 5)
              .map((m) => (
                <li key={m.id} className="flex items-center justify-between py-2">
                  <span className="truncate text-charcoal/80">{m.name}</span>
                  <span className="text-dim-gray">{m.plan}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- members ------------------------------ */

type MemberFilter = "all" | "invitations" | "collaborators" | "requests";

function Members({ data, reload }: { data: AdminSnapshot; reload: () => Promise<void> }) {
  const [filter, setFilter] = useState<MemberFilter>("all");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ name: "", email: "" });
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteRole, setInviteRole] = useState("member");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.members.filter((m) => {
      const matchesQ = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || m.role === roleFilter;
      const matchesFilter =
        filter === "all" ||
        (filter === "collaborators" && m.status === "active") ||
        (filter === "invitations" && m.status === "suspended");
      return matchesQ && matchesRole && matchesFilter;
    });
  }, [data.members, query, roleFilter, filter]);

  async function post(body: Record<string, unknown>, id: string | "new") {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) await reload();
    } finally {
      setBusyId(null);
    }
  }

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.includes("@")) return;
    await post({ action: "create", ...form, role: inviteRole }, "new");
    setForm({ name: "", email: "" });
    setInviteOpen(false);
  }

  function exportCsv() {
    const header = "name,email,role,plan,credits,status,createdAt";
    const lines = rows.map((m) =>
      [m.name, m.email, m.role, m.plan, m.credits, m.status, m.createdAt]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "members.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function toggleAll() {
    setSelected((s) => (s.size === rows.length ? new Set() : new Set(rows.map((r) => r.id))));
  }

  return (
    <div>
      {/* filter pills — Freebuff People ekranındaki All / Invitations / Collaborators / Requests */}
      <div className="flex flex-wrap items-center gap-1">
        {(
          [
            { id: "all", label: "All" },
            { id: "invitations", label: "Invitations" },
            { id: "collaborators", label: "Collaborators" },
            { id: "requests", label: "Requests" },
          ] as { id: MemberFilter; label: string }[]
        ).map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
              filter === f.id
                ? "bg-charcoal text-parchment"
                : "border border-linen-border text-dim-gray hover:border-stone hover:text-charcoal"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* search + role filter + actions */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="relative min-w-44 flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim-gray">
            ⌕
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="w-full rounded-xl border border-linen-border bg-parchment py-2 pl-8 pr-3 text-[13px] text-charcoal outline-none placeholder:text-dim-gray focus:border-stone"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-linen-border bg-parchment px-3 py-2 text-[13px] text-charcoal outline-none"
        >
          <option value="all">All roles</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>
        <div className="ms-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInviteOpen((v) => !v)}
            className="rounded-xl border border-linen-border px-3 py-2 text-[13px] text-charcoal transition-colors hover:border-stone"
          >
            <Plus className="mr-1 inline size-3.5" /> Invite link
          </button>
          <button
            type="button"
            onClick={() => setInviteOpen((v) => !v)}
            className="rounded-xl bg-charcoal px-3 py-2 text-[13px] text-parchment transition-opacity hover:opacity-90"
          >
            <Users className="mr-1 inline size-3.5" /> Invite members
          </button>
          <button
            type="button"
            onClick={exportCsv}
            className="rounded-xl border border-linen-border px-3 py-2 text-[13px] text-charcoal transition-colors hover:border-stone"
          >
            ⭳ Export
          </button>
        </div>
      </div>

      {/* invite drawer */}
      {inviteOpen ? (
        <form
          onSubmit={addMember}
          className="mt-3 rounded-2xl border border-linen-border bg-warm-sand/60 p-4"
        >
          <p className="text-[13px] font-medium text-charcoal">Workspace invite</p>
          <p className="mt-0.5 text-[12px] text-dim-gray">
            Kişiyi workspace&apos;e ekle — rol ve plan buradan atanır.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="İsim"
              className="w-40 rounded-xl border border-linen-border bg-parchment px-3 py-2 text-[13px] outline-none placeholder:text-dim-gray focus:border-stone"
            />
            <input
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="e-posta"
              className="w-56 rounded-xl border border-linen-border bg-parchment px-3 py-2 text-[13px] outline-none placeholder:text-dim-gray focus:border-stone"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="rounded-xl border border-linen-border bg-parchment px-3 py-2 text-[13px] text-charcoal outline-none"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
            <button
              type="submit"
              className="rounded-xl bg-charcoal px-3.5 py-2 text-[13px] text-parchment transition-opacity hover:opacity-90"
            >
              Davet oluştur
            </button>
            <button
              type="button"
              onClick={() => setInviteOpen(false)}
              className="rounded-xl border border-linen-border px-3.5 py-2 text-[13px] text-charcoal transition-colors hover:border-stone"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {/* table */}
      <div className="mt-3 overflow-x-auto rounded-2xl border border-linen-border bg-parchment">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead className="border-b border-linen-border text-[12px] text-dim-gray">
            <tr>
              <th className="w-10 px-4 py-2.5">
                <input
                  type="checkbox"
                  checked={rows.length > 0 && selected.size === rows.length}
                  onChange={toggleAll}
                  className="accent-black"
                  aria-label="Tümünü seç"
                />
              </th>
              <th className="px-4 py-2.5 font-medium">Name</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Plan</th>
              <th className="px-4 py-2.5 font-medium">Credits</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-linen-border">
            {rows.map((m) => (
              <tr key={m.id} className="transition-colors hover:bg-black/[0.02]">
                <td className="px-4 py-2.5">
                  <input
                    type="checkbox"
                    checked={selected.has(m.id)}
                    onChange={() =>
                      setSelected((s) => {
                        const next = new Set(s);
                        if (next.has(m.id)) next.delete(m.id);
                        else next.add(m.id);
                        return next;
                      })
                    }
                    className="accent-black"
                    aria-label={`${m.name} seç`}
                  />
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4ade80] via-[#22c55e] to-[#0ea5e9] text-[11px] font-medium text-parchment">
                      {m.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-charcoal">{m.name}</span>
                      <span className="block truncate text-[12px] text-dim-gray">{m.email}</span>
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <select
                    value={m.role}
                    onChange={(e) => void post({ action: "update", id: m.id, role: e.target.value }, m.id)}
                    className="rounded-lg border border-linen-border bg-parchment px-2 py-1 text-[12px] text-charcoal outline-none"
                  >
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                </td>
                <td className="px-4 py-2.5">
                  <select
                    value={m.plan}
                    onChange={(e) => void post({ action: "update", id: m.id, plan: e.target.value }, m.id)}
                    className="rounded-lg border border-linen-border bg-parchment px-2 py-1 text-[12px] text-charcoal outline-none"
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </td>
                <td className="px-4 py-2.5">
                  <input
                    type="number"
                    defaultValue={m.credits}
                    min={0}
                    onBlur={(e) => {
                      const v = Number(e.target.value);
                      if (v !== m.credits) void post({ action: "update", id: m.id, credits: v }, m.id);
                    }}
                    className="w-20 rounded-lg border border-linen-border bg-parchment px-2 py-1 text-[12px] text-charcoal outline-none"
                  />
                </td>
                <td className="px-4 py-2.5">
                  <button
                    type="button"
                    disabled={busyId === m.id}
                    onClick={() =>
                      void post(
                        { action: "update", id: m.id, status: m.status === "active" ? "suspended" : "active" },
                        m.id,
                      )
                    }
                    className={`rounded-full px-2.5 py-1 text-[12px] transition-colors ${
                      m.status === "active"
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-red-50 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    {m.status === "active" ? "aktif" : "askıda"}
                  </button>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    type="button"
                    disabled={busyId === m.id}
                    onClick={() => void post({ action: "delete", id: m.id }, m.id)}
                    className="inline-flex size-8 items-center justify-center rounded-full text-dim-gray transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`${m.name} üyesini sil`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[12px] text-dim-gray">
        Showing {rows.length ? 1 : 0}-{rows.length} of {rows.length}
      </p>

      {/* bulk bar */}
      {selected.size > 0 ? (
        <div className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-linen-border bg-parchment px-3 py-2 shadow-lg">
          <button
            type="button"
            onClick={toggleAll}
            className="rounded-full px-3 py-1.5 text-[13px] text-charcoal hover:bg-black/[0.04]"
          >
            Select all ({selected.size})
          </button>
          <button
            type="button"
            onClick={() => {
              for (const id of selected) {
                void post({ action: "update", id, status: "suspended" }, id);
              }
              setSelected(new Set());
            }}
            className="rounded-full px-3 py-1.5 text-[13px] text-amber-700 hover:bg-amber-50"
          >
            Askıya al
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="rounded-full px-3 py-1.5 text-[13px] text-dim-gray hover:bg-black/[0.04]"
          >
            Cancel
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------- projects ----------------------------- */

function Projects({ data }: { data: AdminSnapshot }) {
  const rows = useMemo(
    () => [...data.projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [data.projects],
  );
  return (
    <div className="overflow-x-auto rounded-2xl border border-linen-border bg-parchment">
      <table className="w-full min-w-[640px] text-left text-[13px]">
        <thead className="border-b border-linen-border text-[12px] text-dim-gray">
          <tr>
            <th className="px-4 py-2.5 font-medium">Proje</th>
            <th className="px-4 py-2.5 font-medium">Mesaj</th>
            <th className="px-4 py-2.5 font-medium">Dosya</th>
            <th className="px-4 py-2.5 font-medium">Durum</th>
            <th className="px-4 py-2.5 font-medium">Güncelleme</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-linen-border">
          {rows.map((p) => (
            <tr key={p.id} className="transition-colors hover:bg-black/[0.02]">
              <td className="max-w-[280px] px-4 py-2.5">
                <p className="truncate font-medium text-charcoal">{p.name}</p>
                <p className="truncate text-[12px] text-dim-gray">{p.id}</p>
              </td>
              <td className="px-4 py-2.5 text-charcoal/70">{p.messageCount}</td>
              <td className="px-4 py-2.5 text-charcoal/70">{p.fileCount}</td>
              <td className="px-4 py-2.5">
                <span className="inline-flex gap-1">
                  {p.starred ? <Tag>starred</Tag> : null}
                  {p.shared ? <Tag>shared</Tag> : null}
                  {p.published ? <Tag>published</Tag> : null}
                  {!p.starred && !p.shared && !p.published ? <Tag>private</Tag> : null}
                </span>
              </td>
              <td className="px-4 py-2.5 text-dim-gray">
                {new Date(p.updatedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-black/[0.05] px-2 py-0.5 text-[11px] text-dim-gray">{children}</span>
  );
}

/* ------------------------------- connectors ---------------------------- */

function Connectors({ data, reload }: { data: AdminSnapshot; reload: () => Promise<void> }) {
  const [busy, setBusy] = useState<string | null>(null);

  async function toggle(id: string, patch: { enabled?: boolean; connected?: boolean }) {
    setBusy(id);
    try {
      await fetch("/api/admin/connectors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      await reload();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {data.connectors.map((c) => (
        <div key={c.id} className="flex items-center justify-between rounded-2xl border border-linen-border bg-warm-sand/60 p-4">
          <div>
            <p className="text-[14px] font-medium text-charcoal">{c.name}</p>
            <p className="text-[12px] text-dim-gray">{c.description}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 text-[12px] text-dim-gray">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={c.enabled}
                disabled={busy === c.id}
                onChange={(e) => void toggle(c.id, { enabled: e.target.checked })}
                className="accent-black"
              />
              Platformda açık
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={c.connected}
                disabled={busy === c.id}
                onChange={(e) => void toggle(c.id, { connected: e.target.checked })}
                className="accent-black"
              />
              Bağlı
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------- AI -------------------------------- */

function AI({ data, reload }: { data: AdminSnapshot; reload: () => Promise<void> }) {
  const ai = data.overview.ai;
  const [demoFallback, setDemoFallback] = useState(ai.demoFallback);
  const [allowOllama, setAllowOllama] = useState(ai.allowOllama);
  const [maxTokens, setMaxTokens] = useState(ai.maxTokens);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [keyDraft, setKeyDraft] = useState<Record<string, string>>({});

  async function save(body: Record<string, unknown>) {
    setSaving(true);
    try {
      await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await reload();
      setSavedAt(new Date().toLocaleTimeString("tr-TR"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-linen-border bg-warm-sand/60 p-4">
        <p className="text-[13px] font-medium text-charcoal">AI davranışı</p>
        <div className="mt-3 space-y-2.5 text-[13px] text-charcoal/80">
          <label className="flex items-center justify-between gap-4">
            <span>Demo fallback (anahtar yoksa yerel üretici)</span>
            <input
              type="checkbox"
              checked={demoFallback}
              className="accent-black"
              onChange={(e) => setDemoFallback(e.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between gap-4">
            <span>Ollama (yerel modeller) izni</span>
            <input
              type="checkbox"
              checked={allowOllama}
              className="accent-black"
              onChange={(e) => setAllowOllama(e.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between gap-4">
            <span>Maks. token</span>
            <input
              type="number"
              value={maxTokens}
              min={256}
              max={32768}
              step={256}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              className="w-28 rounded-lg border border-linen-border bg-parchment px-2 py-1.5 text-right text-[13px] text-charcoal outline-none"
            />
          </label>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => void save({ ai: { demoFallback, allowOllama, maxTokens } })}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-charcoal px-3.5 py-2 text-[13px] font-medium text-parchment transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : null} Kaydet
        </button>
        {savedAt ? <span className="ms-2 text-[12px] text-emerald-600">Kaydedildi · {savedAt}</span> : null}
      </div>

      <div className="rounded-2xl border border-linen-border bg-warm-sand/60 p-4">
        <p className="text-[13px] font-medium text-charcoal">Sağlayıcı anahtarları</p>
        <p className="mt-1 text-[12px] text-dim-gray">
          Anahtarlar sunucuda saklanır ve istemciye asla dönmez. Ortam değişkeniyle verilen anahtarlar
          (env) önceliklidir.
        </p>
        <div className="mt-3 space-y-2">
          {data.aiProviders.map((p) => {
            const hasEnv = data.aiEnvKeyFlags[p.id];
            const hasStored = data.aiStoredKeyFlags[p.id];
            return (
              <div key={p.id} className="flex flex-wrap items-center gap-2">
                <span className="w-28 truncate text-[13px] text-charcoal/80">{p.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    hasEnv
                      ? "bg-emerald-50 text-emerald-700"
                      : hasStored
                        ? "bg-sky-50 text-sky-700"
                        : "bg-black/[0.05] text-dim-gray"
                  }`}
                >
                  {hasEnv ? "env" : hasStored ? "panel" : "yok"}
                </span>
                <input
                  type="password"
                  value={keyDraft[p.id] ?? ""}
                  onChange={(e) => setKeyDraft((d) => ({ ...d, [p.id]: e.target.value }))}
                  placeholder={hasStored ? "•••••••• (değiştir)" : "API anahtarı"}
                  className="min-w-40 flex-1 rounded-lg border border-linen-border bg-parchment px-2.5 py-1.5 text-[13px] text-charcoal outline-none placeholder:text-dim-gray"
                />
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void save({ providerId: p.id, apiKey: keyDraft[p.id] ?? "" })}
                  className="rounded-full border border-linen-border px-3 py-1.5 text-[12px] text-charcoal transition-colors hover:border-stone"
                >
                  Kaydet
                </button>
                {hasStored ? (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void save({ providerId: p.id, apiKey: null })}
                    className="rounded-full px-2 py-1.5 text-[12px] text-dim-gray transition-colors hover:text-red-600"
                  >
                    Sil
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- billing ------------------------------ */

const money = (n: number) => `$${n.toLocaleString("tr-TR")}`;

function AuditLog({ data }: { data: AdminSnapshot; reload: () => Promise<void> }) {
  const [filter, setFilter] = useActionFilter<"all" | "success" | "error">("all");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "all">("all");

  // Real entries from the append-only server log (data.auditLog, newest first).
  const actions = useMemo<AdminAction[]>(
    () =>
      data.auditLog.map((e) => ({
        id: e.id,
        type: e.action,
        description: e.description,
        user: e.actor,
        timestamp: e.createdAt,
        status: e.status,
        metadata: e.metadata,
      })),
    [data.auditLog],
  );

  const filteredActions = useMemo(() => {
    return actions
      .filter(action => {
        // Filter by action type
        if (filter !== "all" && action.status !== filter) return false;

        // Filter by search term
        if (search &&
            !action.description.toLowerCase().includes(search.toLowerCase()) &&
            !action.user.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }

        // Filter by date range
        const actionDate = new Date(action.timestamp);
        const now = new Date();
        if (dateRange === "today" &&
            actionDate.toDateString() !== now.toDateString()) {
          return false;
        }
        if (dateRange === "week" &&
            actionDate < new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)) {
          return false;
        }
        if (dateRange === "month" &&
            actionDate < new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)) {
          return false;
        }

        return true;
      })
      .sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }, [actions, filter, search, dateRange]);

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-medium text-charcoal">
            Audit Log
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDateRange(prev =>
                prev === "all" ? "today" :
                prev === "today" ? "week" :
                prev === "week" ? "month" : "all"
              )}
              className={`flex items-center gap-1 rounded-full px-3 py-2 text-[12px] tracking-tight transition-colors ${
                dateRange === "all" ? "bg-black/[0.06] font-medium text-ink" :
                "text-dim-gray hover:bg-black/[0.03] hover:text-charcoal"
              }`}
            >
              <Calendar className="size-4" />
              <span className="text-[12px]">
                {dateRange === "all" ? "All time" :
                 dateRange === "today" ? "Today" :
                 dateRange === "week" ? "This week" : "This month"}
              </span>
              <ChevronDown className="size-3.5 text-dim-gray" />
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="grid gap-3 sm:grid-cols-[200px_1fr_120px_80px]">
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-dim-gray">Action type:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as ActionFilter)}
              className="rounded-lg border border-linen-border bg-parchment px-3 py-2 text-[13px] text-charcoal outline-none"
            >
              <option value="all">All actions</option>
              <option value="success">Successful</option>
              <option value="error">Failed</option>
            </select>
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim-gray">
              ⌕
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search actions..."
              className="w-full rounded-lg border border-linen-border bg-parchment pl-8 pr-3 py-2 text-[13px] text-charcoal outline-none placeholder:text-dim-gray focus:border-stone"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setFilter("all");
                setSearch("");
                setDateRange("all");
              }}
              className="text-[12px] text-dim-gray hover:text-charcoal"
            >
              Reset filters
            </button>
          </div>
        </div>
      </div>

      {/* Actions list */}
      <div className="overflow-x-auto rounded-2xl border border-linen-border bg-parchment">
        {actions.length === 0 ? (
          <div className="py-8 text-center text-[13px] text-dim-gray">
            Henüz kayıt yok — panelde bir işlem yaptığında burada görünür.
          </div>
        ) : (
          <div className="space-y-1">
            {filteredActions.length === 0 ? (
              <div className="py-8 text-center text-[13px] text-dim-gray">
                No actions match the current filters
              </div>
            ) : (
              filteredActions.map((action) => (
                <div key={action.id} className="transition-colors hover:bg-black/[0.02]">
                  <div className="flex items-start gap-3 px-4 py-3">
                    {/* Action icon */}
                    <div className="flex size-5 shrink-0 items-center justify-center">
                      {getActionIcon(action.type)}
                    </div>

                    {/* Action details */}
                    <div className="flex-1 space-y-1">
                      <p className="flex items-center justify-between gap-3">
                        <span className="font-medium text-[13px] text-charcoal">
                          {action.description}
                        </span>
                        <span className={`${getActionStatusClass(action.status)} text-[11px]`}>
                          {action.status === "success" ? "Başarılı" : "Başarısız"}
                        </span>
                      </p>
                      <p className="flex items-center gap-3 text-[11px] text-dim-gray">
                        <span>
                          <UserRound className="size-3.5 shrink-0" />
                          {action.user}
                        </span>
                        <span>
                          <Clock className="size-3.5 shrink-0" />
                          {formatRelativeTime(action.timestamp)}
                        </span>
                      </p>
                    </div>

                    {/* Metadata */}
                    {action.metadata && Object.keys(action.metadata).length > 0 && (
                      <div className="mt-1 text-[11px] text-dim-gray">
                        {Object.entries(action.metadata).map(([key, value]) => (
                          <span key={key} className="flex items-center gap-1">
                            <span className="font-medium">{String(key)}:</span>
                            <span>{String(value)}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Export button */}
      {actions.length > 0 && (
        <div className="flex justify-end mt-3">
          <button
            type="button"
            onClick={() => exportAuditLog(filteredActions)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-medium text-charcoal transition-colors hover:bg-black/[0.04]"
          >
            <Download className="size-3.5" /> Export log
          </button>
        </div>
      )}
    </div>
  );
}

// Helper function to get action icon
function getActionIcon(type: string): React.ReactNode {
  switch (type) {
    case "project.create":
      return <Blocks className="text-[10px]" />;
    case "project.delete":
      return <Trash2 className="text-[10px]" />;
    case "project.update":
      return <Settings2 className="text-[10px]" />;
    case "member.invite":
      return <UserRound className="text-[10px]" />;
    case "member.remove":
      return <UserRound className="text-[10px] opacity-50" />;
    case "member.update":
      return <Settings className="text-[10px]" />;
    case "billing.invoice.create":
      return <BadgeDollarSign className="text-[10px]" />;
    case "billing.invoice.update":
      return <RefreshCw className="text-[10px]" />;
    case "billing.invoice.delete":
      return <BadgeDollarSign className="text-[10px] opacity-50" />;
    case "connector.add":
      return <Plug className="text-[10px]" />;
    case "connector.remove":
      return <Plug className="text-[10px] opacity-50" />;
    case "settings.update":
      return <Settings2 className="text-[10px]" />;
    default:
      return <Activity className="text-[10px]" />;
  }
}

// Helper function to get action status class
function getActionStatusClass(status: "success" | "error"): string {
  return status === "success"
    ? "text-emerald-600"
    : "text-red-600";
}

// Helper function to format relative time
function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 5) return "Just now";
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// Helper function to export audit log as CSV
function exportAuditLog(actions: AdminAction[]): void {
  const header = ["Timestamp", "User", "Action", "Description", "Status"];
  const rows = actions.map(action => [
    new Date(action.timestamp).toLocaleString(),
    action.user,
    action.type,
    action.description,
    action.status
  ]);

  const csvContent = [
    header.join(","),
    ...rows.map(row =>
      row.map(field =>
        `"${String(field).replace(/"/g, '""')}"`
      ).join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `audit-log-${new Date().toISOString().slice(0,10)}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Types
type ActionFilter = "all" | "success" | "error";

interface AdminAction {
  id: string;
  type: string;
  description: string;
  user: string;
  timestamp: string;
  status: "success" | "error";
  metadata?: Record<string, unknown>;
}

function useActionFilter<T extends string>(initialValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  return [value, setValue];
}

function Billing({ data, reload }: { data: AdminSnapshot; reload: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const invForm = useFormState({ memberId: data.members[0]?.id ?? "", amount: 25, description: "" });
  const pmForm = useFormState({
    memberId: data.members[0]?.id ?? "",
    brand: "visa",
    last4: "",
    expMonth: 12,
    expYear: new Date().getFullYear() + 3,
  });

  async function post(body: Record<string, unknown>) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) await reload();
    } finally {
      setBusy(false);
    }
  }

  const memberName = (id: string) => data.members.find((m) => m.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-[14px] font-medium text-charcoal">Faturalar</h2>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-linen-border bg-warm-sand/60 p-3">
          <select
            {...invForm.bind("memberId")}
            className="rounded-xl border border-linen-border bg-parchment px-3 py-2 text-[13px] text-charcoal outline-none"
          >
            {data.members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <input
            {...invForm.bind("amount")}
            type="number"
            min={0}
            className="w-24 rounded-xl border border-linen-border bg-parchment px-3 py-2 text-[13px] text-charcoal outline-none"
          />
          <input
            {...invForm.bind("description")}
            placeholder="Açıklama"
            className="w-48 rounded-xl border border-linen-border bg-parchment px-3 py-2 text-[13px] text-charcoal outline-none placeholder:text-dim-gray"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void post({
                action: "invoice.create",
                memberId: invForm.values.memberId,
                amount: Number(invForm.values.amount),
                description: invForm.values.description,
              })
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-charcoal px-3.5 py-2 text-[13px] font-medium text-parchment transition-opacity hover:opacity-90"
          >
            <Plus className="size-3.5" /> Fatura ekle
          </button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-linen-border bg-parchment">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="border-b border-linen-border text-[12px] text-dim-gray">
              <tr>
                <th className="px-4 py-2.5 font-medium">No</th>
                <th className="px-4 py-2.5 font-medium">Üye</th>
                <th className="px-4 py-2.5 font-medium">Tutar</th>
                <th className="px-4 py-2.5 font-medium">Durum</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-linen-border">
              {data.invoices.map((i) => (
                <tr key={i.id} className="transition-colors hover:bg-black/[0.02]">
                  <td className="px-4 py-2.5 font-medium text-charcoal">{i.number}</td>
                  <td className="px-4 py-2.5 text-charcoal/70">{memberName(i.memberId)}</td>
                  <td className="px-4 py-2.5 text-charcoal">{money(i.amount)}</td>
                  <td className="px-4 py-2.5">
                    <select
                      value={i.status}
                      onChange={(e) => void post({ action: "invoice.update", id: i.id, status: e.target.value })}
                      className={`rounded-lg border border-linen-border bg-parchment px-2 py-1 text-[12px] outline-none ${
                        i.status === "paid"
                          ? "text-emerald-700"
                          : i.status === "open"
                            ? "text-amber-700"
                            : "text-dim-gray"
                      }`}
                    >
                      <option value="paid">paid</option>
                      <option value="open">open</option>
                      <option value="void">void</option>
                    </select>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void post({ action: "invoice.delete", id: i.id })}
                      className="inline-flex size-8 items-center justify-center rounded-full text-dim-gray transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={`${i.number} faturasını sil`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-[14px] font-medium text-charcoal">
          <CreditCard className="size-4 text-dim-gray" /> Ödeme yöntemleri
        </h2>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-linen-border bg-warm-sand/60 p-3">
          <select
            {...pmForm.bind("memberId")}
            className="rounded-xl border border-linen-border bg-parchment px-3 py-2 text-[13px] text-charcoal outline-none"
          >
            {data.members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <select
            {...pmForm.bind("brand")}
            className="rounded-xl border border-linen-border bg-parchment px-3 py-2 text-[13px] text-charcoal outline-none"
          >
            <option value="visa">visa</option>
            <option value="mastercard">mastercard</option>
            <option value="amex">amex</option>
          </select>
          <input
            {...pmForm.bind("last4")}
            placeholder="Son 4 hane"
            maxLength={4}
            className="w-28 rounded-xl border border-linen-border bg-parchment px-3 py-2 text-[13px] text-charcoal outline-none placeholder:text-dim-gray"
          />
          <input
            {...pmForm.bind("expMonth")}
            type="number"
            min={1}
            max={12}
            className="w-16 rounded-xl border border-linen-border bg-parchment px-3 py-2 text-[13px] text-charcoal outline-none"
          />
          <input
            {...pmForm.bind("expYear")}
            type="number"
            className="w-24 rounded-xl border border-linen-border bg-parchment px-3 py-2 text-[13px] text-charcoal outline-none"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void post({
                action: "pm.create",
                memberId: pmForm.values.memberId,
                brand: pmForm.values.brand,
                last4: pmForm.values.last4,
                expMonth: Number(pmForm.values.expMonth),
                expYear: Number(pmForm.values.expYear),
              })
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-charcoal px-3.5 py-2 text-[13px] font-medium text-parchment transition-opacity hover:opacity-90"
          >
            <Plus className="size-3.5" /> Kart ekle
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.paymentMethods.map((pm) => (
            <div key={pm.id} className="flex items-center justify-between rounded-2xl border border-linen-border bg-warm-sand/60 p-4">
              <div>
                <p className="text-[14px] font-medium capitalize text-charcoal">
                  {pm.brand} •••• {pm.last4}
                </p>
                <p className="text-[12px] text-dim-gray">
                  {memberName(pm.memberId)} · {String(pm.expMonth).padStart(2, "0")}/{pm.expYear}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {pm.isDefault ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">varsayılan</span>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void post({ action: "pm.update", id: pm.id, isDefault: true })}
                    className="rounded-full border border-linen-border px-2.5 py-1 text-[12px] text-charcoal transition-colors hover:border-stone"
                  >
                    Varsayılan yap
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void post({ action: "pm.delete", id: pm.id })}
                  className="inline-flex size-8 items-center justify-center rounded-full text-dim-gray transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label="Kartı sil"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
