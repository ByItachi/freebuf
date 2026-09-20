"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormState } from "./use-form-state";
import type { AdminSnapshot } from "@/lib/admin-types";
import {
  BadgeDollarSign,
  Blocks,
  CreditCard,
  Inbox,
  Loader2,
  LogOut,
  Plug,
  Plus,
  RefreshCw,
  Server,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";

type Tab = "overview" | "members" | "projects" | "connectors" | "ai" | "billing";

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Genel bakış", icon: Inbox },
  { id: "members", label: "Üyeler", icon: Users },
  { id: "projects", label: "Projeler", icon: Blocks },
  { id: "connectors", label: "Connectorlar", icon: Plug },
  { id: "ai", label: "AI", icon: Sparkles },
  { id: "billing", label: "Faturalar & Ödeme", icon: BadgeDollarSign },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [data, setData] = useState<AdminSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Load the snapshot lazily so we never call setState synchronously in an effect.
  useEffect(() => {
    const t = setTimeout(() => void load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-[#141412] text-white">
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/[0.06]">
              <Server className="size-4.5" />
            </span>
            <div>
              <p className="text-[15px] font-medium tracking-tight">crowl admin</p>
              <p className="text-[12px] text-white/40">Tüm platform verileri ve yapılandırmalar</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void load()}
              className="flex size-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
              aria-label="Yenile"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              type="button"
              onClick={() => void logout()}
              className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[13px] text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <LogOut className="size-3.5" /> Çıkış
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
                tab === t.id
                  ? "bg-white text-black"
                  : "text-white/55 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <t.icon className="size-3.5" /> {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6">
        {error ? (
          <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
            {error}
          </p>
        ) : null}
        {loading && !data ? (
          <div className="flex items-center gap-2 py-16 text-white/50">
            <Loader2 className="size-4 animate-spin" /> Yükleniyor…
          </div>
        ) : null}
        {data ? (
          <>
            {tab === "overview" ? <Overview data={data} /> : null}
            {tab === "members" ? <Members data={data} reload={load} /> : null}
            {tab === "projects" ? <Projects data={data} /> : null}
            {tab === "connectors" ? <Connectors data={data} reload={load} /> : null}
            {tab === "ai" ? <AI data={data} reload={load} /> : null}
            {tab === "billing" ? <Billing data={data} reload={load} /> : null}
          </>
        ) : null}
      </main>
    </div>
  );
}

/* ------------------------------- overview ------------------------------ */

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
      <p className="text-[12px] uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1 text-[24px] font-medium tracking-tight">{value}</p>
      {hint ? <p className="text-[12px] text-white/40">{hint}</p> : null}
    </div>
  );
}

function Overview({ data }: { data: AdminSnapshot }) {
  const o = data.overview;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Üyeler" value={String(o.members)} hint={`${o.activeMembers} aktif, ${o.suspendedMembers} askıda`} />
        <Stat label="Tahsil edilen" value={`$${o.paidRevenue}`} hint={`Açık fatura: $${o.openRevenue}`} />
        <Stat label="Projeler" value={String(data.projects.length)} hint={`${data.projects.reduce((s, p) => s + p.messageCount, 0)} mesaj`} />
        <Stat label="Connectorlar" value={`${o.connectedCount}/${o.enabledCount}`} hint="bağlı / açık" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
          <p className="text-[13px] font-medium">Son faturalar</p>
          <ul className="mt-2 divide-y divide-white/[0.06] text-[13px]">
            {data.invoices.slice(0, 5).map((i) => (
              <li key={i.id} className="flex items-center justify-between py-2">
                <span className="text-white/70">{i.number}</span>
                <span className={i.status === "paid" ? "text-emerald-400" : i.status === "open" ? "text-amber-400" : "text-white/40"}>
                  ${i.amount} · {i.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
          <p className="text-[13px] font-medium">Yeni üyeler</p>
          <ul className="mt-2 divide-y divide-white/[0.06] text-[13px]">
            {[...data.members]
              .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
              .slice(0, 5)
              .map((m) => (
                <li key={m.id} className="flex items-center justify-between py-2">
                  <span className="truncate text-white/70">{m.name}</span>
                  <span className="text-white/40">{m.plan}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- members ------------------------------ */

function Members({ data, reload }: { data: AdminSnapshot; reload: () => Promise<void> }) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });

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

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.includes("@")) return;
    await post({ action: "create", ...form }, "new");
    setForm({ name: "", email: "" });
  }

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
        <input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="İsim"
          className="w-44 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] outline-none placeholder:text-white/30 focus:border-white/25"
        />
        <input
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="e-posta"
          className="w-56 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] outline-none placeholder:text-white/30 focus:border-white/25"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[13px] font-medium text-black transition-opacity hover:opacity-90"
        >
          <Plus className="size-3.5" /> Üye ekle
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead className="bg-white/[0.04] text-[12px] uppercase tracking-wide text-white/40">
            <tr>
              <th className="px-4 py-2.5 font-medium">Üye</th>
              <th className="px-4 py-2.5 font-medium">Rol</th>
              <th className="px-4 py-2.5 font-medium">Plan</th>
              <th className="px-4 py-2.5 font-medium">Kredi</th>
              <th className="px-4 py-2.5 font-medium">Durum</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {data.members.map((m) => (
              <tr key={m.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-4 py-2.5">
                  <p className="font-medium">{m.name}</p>
                  <p className="text-[12px] text-white/40">{m.email}</p>
                </td>
                <td className="px-4 py-2.5">
                  <select
                    value={m.role}
                    onChange={(e) => void post({ action: "update", id: m.id, role: e.target.value }, m.id)}
                    className="rounded-lg border border-white/10 bg-[#1c1c1a] px-2 py-1 text-[12px] outline-none"
                  >
                    <option value="owner">owner</option>
                    <option value="admin">admin</option>
                    <option value="member">member</option>
                  </select>
                </td>
                <td className="px-4 py-2.5">
                  <select
                    value={m.plan}
                    onChange={(e) => void post({ action: "update", id: m.id, plan: e.target.value }, m.id)}
                    className="rounded-lg border border-white/10 bg-[#1c1c1a] px-2 py-1 text-[12px] outline-none"
                  >
                    <option value="free">free</option>
                    <option value="pro">pro</option>
                    <option value="enterprise">enterprise</option>
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
                    className="w-20 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[12px] outline-none"
                  />
                </td>
                <td className="px-4 py-2.5">
                  <button
                    type="button"
                    disabled={busyId === m.id}
                    onClick={() => void post({ action: "update", id: m.id, status: m.status === "active" ? "suspended" : "active" }, m.id)}
                    className={`rounded-full px-2.5 py-1 text-[12px] ${
                      m.status === "active"
                        ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                        : "bg-red-500/15 text-red-400 hover:bg-red-500/25"
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
                    className="inline-flex size-8 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-red-500/15 hover:text-red-400"
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
    </div>
  );
}

/* -------------------------------- projects ----------------------------- */

function Projects({ data }: { data: AdminSnapshot }) {
  const rows = useMemo(
    () =>
      [...data.projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [data.projects],
  );
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
      <table className="w-full min-w-[640px] text-left text-[13px]">
        <thead className="bg-white/[0.04] text-[12px] uppercase tracking-wide text-white/40">
          <tr>
            <th className="px-4 py-2.5 font-medium">Proje</th>
            <th className="px-4 py-2.5 font-medium">Mesaj</th>
            <th className="px-4 py-2.5 font-medium">Dosya</th>
            <th className="px-4 py-2.5 font-medium">Durum</th>
            <th className="px-4 py-2.5 font-medium">Güncelleme</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {rows.map((p) => (
            <tr key={p.id} className="transition-colors hover:bg-white/[0.02]">
              <td className="max-w-[280px] px-4 py-2.5">
                <p className="truncate font-medium">{p.name}</p>
                <p className="truncate text-[12px] text-white/30">{p.id}</p>
              </td>
              <td className="px-4 py-2.5 text-white/60">{p.messageCount}</td>
              <td className="px-4 py-2.5 text-white/60">{p.fileCount}</td>
              <td className="px-4 py-2.5">
                <span className="inline-flex gap-1">
                  {p.starred ? <Tag>starred</Tag> : null}
                  {p.shared ? <Tag>shared</Tag> : null}
                  {p.published ? <Tag>published</Tag> : null}
                  {!p.starred && !p.shared && !p.published ? <Tag>private</Tag> : null}
                </span>
              </td>
              <td className="px-4 py-2.5 text-white/40">
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
    <span className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[11px] text-white/60">{children}</span>
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
        <div key={c.id} className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
          <div>
            <p className="text-[14px] font-medium">{c.name}</p>
            <p className="text-[12px] text-white/40">{c.description}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <label className="flex items-center gap-2 text-[12px] text-white/50">
              <input
                type="checkbox"
                checked={c.enabled}
                disabled={busy === c.id}
                onChange={(e) => void toggle(c.id, { enabled: e.target.checked })}
                className="accent-white"
              />
              Platformda açık
            </label>
            <label className="flex items-center gap-2 text-[12px] text-white/50">
              <input
                type="checkbox"
                checked={c.connected}
                disabled={busy === c.id}
                onChange={(e) => void toggle(c.id, { connected: e.target.checked })}
                className="accent-white"
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
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
        <p className="text-[13px] font-medium">AI davranışı</p>
        <div className="mt-3 space-y-2.5 text-[13px]">
          <label className="flex items-center justify-between gap-4">
            <span className="text-white/70">Demo fallback (anahtar yoksa yerel üretici)</span>
            <input
              type="checkbox"
              checked={demoFallback}
              className="accent-white"
              onChange={(e) => setDemoFallback(e.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between gap-4">
            <span className="text-white/70">Ollama (yerel modeller) izni</span>
            <input
              type="checkbox"
              checked={allowOllama}
              className="accent-white"
              onChange={(e) => setAllowOllama(e.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between gap-4">
            <span className="text-white/70">Maks. token</span>
            <input
              type="number"
              value={maxTokens}
              min={256}
              max={32768}
              step={256}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              className="w-28 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-right text-[13px] outline-none"
            />
          </label>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() =>
            void save({ ai: { demoFallback, allowOllama, maxTokens } })
          }
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[13px] font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : null} Kaydet
        </button>
        {savedAt ? <span className="ms-2 text-[12px] text-emerald-400">Kaydedildi · {savedAt}</span> : null}
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
        <p className="text-[13px] font-medium">Sağlayıcı anahtarları</p>
        <p className="mt-1 text-[12px] text-white/40">
          Anahtarlar sunucuda saklanır ve istemciye asla dönmez. Ortam değişkeniyle verilen anahtarlar
          (env) önceliklidir.
        </p>
        <div className="mt-3 space-y-2">
          {data.aiProviders.map((p) => {
            const hasEnv = data.aiEnvKeyFlags[p.id];
            const hasStored = data.aiStoredKeyFlags[p.id];
            return (
              <div key={p.id} className="flex flex-wrap items-center gap-2">
                <span className="w-28 truncate text-[13px] text-white/70">{p.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    hasEnv
                      ? "bg-emerald-500/15 text-emerald-400"
                      : hasStored
                        ? "bg-sky-500/15 text-sky-400"
                        : "bg-white/[0.06] text-white/40"
                  }`}
                >
                  {hasEnv ? "env" : hasStored ? "panel" : "yok"}
                </span>
                <input
                  type="password"
                  value={keyDraft[p.id] ?? ""}
                  onChange={(e) => setKeyDraft((d) => ({ ...d, [p.id]: e.target.value }))}
                  placeholder={hasStored ? "•••••••• (değiştir)" : "API anahtarı"}
                  className="min-w-40 flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[13px] outline-none placeholder:text-white/30"
                />
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void save({ providerId: p.id, apiKey: keyDraft[p.id] ?? "" })}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  Kaydet
                </button>
                {hasStored ? (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void save({ providerId: p.id, apiKey: null })}
                    className="rounded-full px-2 py-1.5 text-[12px] text-white/40 transition-colors hover:text-red-400"
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
        <h2 className="text-[14px] font-medium">Faturalar</h2>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
          <select
            {...invForm.bind("memberId")}
            className="rounded-xl border border-white/10 bg-[#1c1c1a] px-3 py-2 text-[13px] outline-none"
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
            className="w-24 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] outline-none"
          />
          <input
            {...invForm.bind("description")}
            placeholder="Açıklama"
            className="w-48 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] outline-none placeholder:text-white/30"
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
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[13px] font-medium text-black transition-opacity hover:opacity-90"
          >
            <Plus className="size-3.5" /> Fatura ekle
          </button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="bg-white/[0.04] text-[12px] uppercase tracking-wide text-white/40">
              <tr>
                <th className="px-4 py-2.5 font-medium">No</th>
                <th className="px-4 py-2.5 font-medium">Üye</th>
                <th className="px-4 py-2.5 font-medium">Tutar</th>
                <th className="px-4 py-2.5 font-medium">Durum</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {data.invoices.map((i) => (
                <tr key={i.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-2.5 font-medium">{i.number}</td>
                  <td className="px-4 py-2.5 text-white/60">{memberName(i.memberId)}</td>
                  <td className="px-4 py-2.5">{money(i.amount)}</td>
                  <td className="px-4 py-2.5">
                    <select
                      value={i.status}
                      onChange={(e) => void post({ action: "invoice.update", id: i.id, status: e.target.value })}
                      className={`rounded-lg border border-white/10 bg-[#1c1c1a] px-2 py-1 text-[12px] outline-none ${
                        i.status === "paid"
                          ? "text-emerald-400"
                          : i.status === "open"
                            ? "text-amber-400"
                            : "text-white/40"
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
                      className="inline-flex size-8 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-red-500/15 hover:text-red-400"
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
        <h2 className="flex items-center gap-2 text-[14px] font-medium">
          <CreditCard className="size-4 text-white/50" /> Ödeme yöntemleri
        </h2>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
          <select
            {...pmForm.bind("memberId")}
            className="rounded-xl border border-white/10 bg-[#1c1c1a] px-3 py-2 text-[13px] outline-none"
          >
            {data.members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <select
            {...pmForm.bind("brand")}
            className="rounded-xl border border-white/10 bg-[#1c1c1a] px-3 py-2 text-[13px] outline-none"
          >
            <option value="visa">visa</option>
            <option value="mastercard">mastercard</option>
            <option value="amex">amex</option>
          </select>
          <input
            {...pmForm.bind("last4")}
            placeholder="Son 4 hane"
            maxLength={4}
            className="w-28 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] outline-none placeholder:text-white/30"
          />
          <input
            {...pmForm.bind("expMonth")}
            type="number"
            min={1}
            max={12}
            className="w-16 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] outline-none"
          />
          <input
            {...pmForm.bind("expYear")}
            type="number"
            className="w-24 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] outline-none"
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
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[13px] font-medium text-black transition-opacity hover:opacity-90"
          >
            <Plus className="size-3.5" /> Kart ekle
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.paymentMethods.map((pm) => (
            <div key={pm.id} className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <div>
                <p className="text-[14px] font-medium capitalize">
                  {pm.brand} •••• {pm.last4}
                </p>
                <p className="text-[12px] text-white/40">
                  {memberName(pm.memberId)} · {String(pm.expMonth).padStart(2, "0")}/{pm.expYear}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {pm.isDefault ? (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-400">varsayılan</span>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void post({ action: "pm.update", id: pm.id, isDefault: true })}
                    className="rounded-full border border-white/10 px-2.5 py-1 text-[12px] text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    Varsayılan yap
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void post({ action: "pm.delete", id: pm.id })}
                  className="inline-flex size-8 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-red-500/15 hover:text-red-400"
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