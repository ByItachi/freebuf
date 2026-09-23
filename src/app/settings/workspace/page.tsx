"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeDollarSign,
  Blocks,
  BookOpen,
  Copy,
  Fingerprint,
  GitBranch,
  GraduationCap,
  LayoutTemplate,
  MonitorSmartphone,
  Palette,
  Plug,
  ScrollText,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react";
import { AppSidebar } from "@/components/app/app-sidebar";
import { useUser } from "@/lib/use-user";
import { CREDITS_LIMIT, readCredits, type CreditState } from "@/lib/credits";

type NavItem = { label: string; href: string; icon: typeof Users; badge?: string };

const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "",
    items: [
      { label: "Your account", href: "/dashboard/settings", icon: UserRound },
      { label: "Devices & apps", href: "/dashboard/settings", icon: MonitorSmartphone },
    ],
  },
  {
    group: "Workspace",
    items: [
      { label: "General", href: "/settings/workspace", icon: Server },
      { label: "Plans & credit usage", href: "/settings/billing", icon: BadgeDollarSign },
      { label: "Connectors", href: "/dashboard/connectors", icon: Plug },
    ],
  },
  {
    group: "Access",
    items: [
      { label: "People", href: "/admin?tab=members", icon: Users },
      { label: "Groups", href: "/admin?tab=members", icon: UsersRound, badge: "Business" },
      { label: "Identity", href: "/admin?tab=members", icon: Fingerprint, badge: "Business" },
      { label: "Access tokens", href: "/admin?tab=members", icon: ScrollText, badge: "Business" },
    ],
  },
  {
    group: "Customization",
    items: [
      { label: "Knowledge", href: "/admin", icon: BookOpen },
      { label: "Skills", href: "/admin", icon: GraduationCap },
      { label: "Templates", href: "/admin", icon: LayoutTemplate, badge: "Business" },
      { label: "Design systems", href: "/admin", icon: Palette, badge: "Enterprise" },
    ],
  },
  {
    group: "Build & deploy",
    items: [
      { label: "Projects", href: "/admin?tab=projects", icon: Blocks },
      { label: "Git", href: "/admin?tab=projects", icon: GitBranch },
      { label: "AI & cloud balance", href: "/admin?tab=ai", icon: Sparkles },
    ],
  },
  {
    group: "Security",
    items: [
      { label: "Privacy & security", href: "/admin?tab=audit", icon: ShieldCheck },
      { label: "Security center", href: "/admin?tab=audit", icon: ShieldAlert, badge: "Business" },
      { label: "Audit log", href: "/admin?tab=audit", icon: ScrollText, badge: "Enterprise" },
    ],
  },
];

const badgeCls =
  "ml-1.5 inline-flex items-center rounded-full border border-[#c9c4f2] bg-[#efedfb] px-1.5 py-0.5 text-[9.5px] font-medium text-[#5b4fc4] dark:border-[#4a4390] dark:bg-[#34305c] dark:text-[#b6b0ee]";

export default function WorkspaceSettingsPage() {
  const router = useRouter();
  const { user, initials } = useUser();
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  const [creditLimit, setCreditLimit] = useState("");
  const [credits, setCredits] = useState<CreditState | null>(null);
  const [handle, setHandle] = useState("");
  const [handleSaved, setHandleSaved] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteCopied, setInviteCopied] = useState(false);

  // Defer localStorage reads to a task so SSR markup matches the first paint.
  useEffect(() => {
    const t = setTimeout(() => {
      setCredits(readCredits());
      if (!name) setName(user?.name ? `${user.name}'s Lovable` : "Gürkan's Lovable");
    }, 0);
    const sync = () => setCredits(readCredits());
    window.addEventListener("lovable:credits-changed", sync);
    return () => {
      clearTimeout(t);
      window.removeEventListener("lovable:credits-changed", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once from stored identity
  }, []);

  const workspaceId = "HzDofeyhBUsAjH4oR1FU";
  const inviteLink = `https://lovable.dev/invite/${workspaceId}`;
  const remaining = credits ? Math.max(0, CREDITS_LIMIT - credits.used) : CREDITS_LIMIT;

  const filteredNav = NAV.map((g) => ({
    ...g,
    items: g.items.filter((i) => i.label.toLowerCase().includes(query.trim().toLowerCase())),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex min-h-screen w-full flex-col bg-parchment text-charcoal md:flex-row">
      {/* standalone shell: hide the marketing header/footer like the dashboard layout */}
      <style dangerouslySetInnerHTML={{ __html: "header, footer, #cookie-banner { display: none !important; } body { margin: 0; padding: 0; }" }} />
      <AppSidebarWrapper />
      <main className="flex w-full flex-1 flex-col transition-[padding] duration-200 md:ml-64">
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 gap-0 px-0 md:px-8">
          {/* ===== Settings nav ===== */}
          <aside className="hidden w-[248px] shrink-0 flex-col gap-1 overflow-y-auto py-6 pr-4 lg:flex" aria-label="Settings">
            <Link
              href="/dashboard"
              className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-1.5 text-[13.5px] font-medium tracking-tight text-charcoal transition-colors hover:bg-black/[0.04]"
            >
              <ArrowLeft className="size-4" /> Go back
            </Link>
            <label className="relative mb-2 block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dim-gray" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search settings"
                aria-label="Search settings"
                className="w-full rounded-xl border border-linen-border bg-warm-sand py-2 pl-9 pr-3 text-[13px] tracking-tight outline-none placeholder:text-dim-gray focus:border-stone"
              />
            </label>
            {filteredNav.map((g, gi) => (
              <div key={g.group || gi} className="mb-2">
                {g.group ? (
                  <p className="px-2 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-dim-gray">{g.group}</p>
                ) : null}
                {g.items.map((item) => {
                  const active = item.href === "/settings/workspace" && item.label === "General";
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] tracking-tight transition-colors ${
                        active
                          ? "bg-black/[0.06] font-medium text-ink"
                          : "text-dim-gray hover:bg-black/[0.03] hover:text-charcoal"
                      }`}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.badge ? <span className={badgeCls}>{item.badge}</span> : null}
                    </Link>
                  );
                })}
              </div>
            ))}
          </aside>

          {/* ===== Content ===== */}
          <section className="min-w-0 flex-1 px-4 py-6 md:px-10 md:py-8">
            <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
              <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium tracking-tight text-charcoal">
                <ArrowLeft className="size-4" /> Go back
              </Link>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-[26px] font-medium tracking-tight md:text-[30px]">Workspace settings</h1>
                <p className="mt-1 text-[14px] text-dim-gray">Workspaces allow you to collaborate on projects in real time.</p>
              </div>
              <Link
                href="/guides"
                className="inline-flex items-center gap-1.5 rounded-full border border-linen-border bg-parchment px-3 py-1.5 text-[13px] font-medium text-charcoal transition-colors hover:bg-black/[0.04]"
              >
                <BookOpen className="size-4" /> Docs
              </Link>
            </div>

            <h2 className="mt-8 text-[19px] font-medium tracking-tight">Workspace profile</h2>
            <p className="mt-0.5 text-[13.5px] text-dim-gray">Control how this workspace appears on Lovable.</p>

            <div className="mt-4 rounded-3xl border border-linen-border bg-warm-sand/60 p-5 md:p-6">
              {/* Avatar */}
              <div className="flex items-center justify-between gap-4 pb-5">
                <div>
                  <p className="text-[14.5px] font-medium tracking-tight">Avatar</p>
                  <p className="mt-0.5 text-[13px] text-dim-gray">Set an avatar for your workspace.</p>
                </div>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-charcoal text-[13px] font-semibold text-parchment">
                  {(initials || "G").slice(0, 1)}
                </span>
              </div>
              <div className="h-px bg-linen-border" />
              {/* Name */}
              <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[14.5px] font-medium tracking-tight">Name</p>
                  <p className="mt-0.5 text-[13px] text-dim-gray">Your full workspace name, as visible to others.</p>
                </div>
                <div className="w-full sm:w-[280px]">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 50))}
                    aria-label="Workspace name"
                    className="w-full rounded-xl border border-linen-border bg-parchment px-3 py-2 text-[13.5px] tracking-tight outline-none focus:border-stone"
                  />
                  <p className="mt-1 text-right text-[11px] text-dim-gray">{name.length} / 50 characters</p>
                </div>
              </div>
              <div className="h-px bg-linen-border" />
              {/* Workspace ID */}
              <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[14.5px] font-medium tracking-tight">Workspace ID</p>
                  <p className="mt-0.5 text-[13px] text-dim-gray">Unique workspace identifier</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      void navigator.clipboard?.writeText(workspaceId);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1200);
                    } catch {}
                  }}
                  className="inline-flex items-center gap-2 font-mono text-[12.5px] text-charcoal transition-colors hover:text-ink"
                >
                  {workspaceId}
                  <Copy className="size-3.5 text-dim-gray" />
                  <span className="sr-only">{copied ? "Copied" : "Copy workspace ID"}</span>
                </button>
              </div>
              <div className="h-px bg-linen-border" />
              {/* Handle */}
              <div className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[14.5px] font-medium tracking-tight">Workspace handle</p>
                  <p className="mt-0.5 text-[13px] text-dim-gray">Set a handle for the workspace profile page.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const slug = name
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, "");
                    if (slug) {
                      setHandle(slug);
                      setHandleSaved(false);
                    }
                  }}
                  className="rounded-buttons border border-linen-border bg-parchment px-4 py-2 text-[13px] font-medium text-charcoal transition-colors hover:bg-black/[0.04]"
                >
                  Set handle
                </button>
              </div>
              {handle ? (
                <div className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[14.5px] font-medium tracking-tight">Preview</p>
                    <p className="mt-0.5 text-[13px] text-dim-gray">Your workspace profile URL.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="rounded-lg bg-warm-sand px-2.5 py-1.5 font-mono text-[12.5px] text-charcoal">lovable.dev/w/{handle}</code>
                    <button
                      type="button"
                      onClick={() => setHandleSaved(true)}
                      className="rounded-full bg-charcoal px-3.5 py-1.5 text-[12.5px] font-medium text-parchment transition-opacity hover:opacity-90"
                    >
                      {handleSaved ? "Saved ✓" : "Save"}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <h2 id="invite" className="mt-10 scroll-mt-8 text-[19px] font-medium tracking-tight">Invite members</h2>
            <p className="mt-0.5 text-[13.5px] text-dim-gray">Bring collaborators into this workspace.</p>
            <div className="mt-4 rounded-3xl border border-linen-border bg-warm-sand/60 p-5 md:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[14.5px] font-medium tracking-tight">Invite link</p>
                  <p className="mt-0.5 truncate text-[13px] text-dim-gray">Anyone with this link can request to join.</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="teammate@company.com"
                    inputMode="email"
                    aria-label="Invite by email"
                    className="w-full rounded-xl border border-linen-border bg-parchment px-3 py-2 text-[13.5px] tracking-tight outline-none placeholder:text-dim-gray/70 focus:border-stone sm:w-[220px]"
                  />
                  <button
                    type="button"
                    disabled={!inviteEmail.includes("@")}
                    onClick={() => {
                      setInviteEmail("");
                      setInviteCopied(true);
                      setTimeout(() => setInviteCopied(false), 1500);
                    }}
                    className="shrink-0 rounded-full bg-charcoal px-4 py-2 text-[13px] font-medium text-parchment transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    {inviteCopied ? "Sent ✓" : "Send invite"}
                  </button>
                </div>
              </div>
              <div className="mt-5 h-px bg-linen-border" />
              <div className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[14.5px] font-medium tracking-tight">Or share a link</p>
                  <p className="mt-0.5 truncate font-mono text-[12px] text-dim-gray">{inviteLink}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      void navigator.clipboard?.writeText(inviteLink);
                      setInviteCopied(true);
                      setTimeout(() => setInviteCopied(false), 1500);
                    } catch {}
                  }}
                  className="shrink-0 rounded-buttons border border-linen-border bg-parchment px-4 py-2 text-[13px] font-medium text-charcoal transition-colors hover:bg-black/[0.04]"
                >
                  <Copy className="mr-1.5 inline size-3.5" />
                  {inviteCopied ? "Copied ✓" : "Copy link"}
                </button>
              </div>
            </div>

            <h2 className="mt-10 text-[19px] font-medium tracking-tight">Member defaults</h2>
            <p className="mt-0.5 text-[13.5px] text-dim-gray">Set default limits for workspace members.</p>
            <div className="mt-4 rounded-3xl border border-linen-border bg-warm-sand/60 p-5 md:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[14.5px] font-medium tracking-tight">Default monthly member credit limit</p>
                  <p className="mt-0.5 max-w-md text-[13px] text-dim-gray">
                    The default monthly credit limit for members of this workspace. Leave empty to use no limit.
                  </p>
                </div>
                <input
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                  inputMode="numeric"
                  placeholder="Enter default monthly member credit limit"
                  aria-label="Default monthly member credit limit"
                  className="w-full rounded-xl border border-linen-border bg-parchment px-3 py-2 text-[13.5px] tracking-tight outline-none placeholder:text-dim-gray/70 focus:border-stone sm:w-[260px]"
                />
              </div>
            </div>

            <h2 className="mt-10 text-[19px] font-medium tracking-tight">Plans &amp; credits</h2>
            <div className="mt-4 rounded-3xl border border-linen-border bg-warm-sand/60 p-5 md:p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[14.5px] font-medium tracking-tight">Daily build credits</p>
                <p className="text-[13px] text-dim-gray">{remaining} of {CREDITS_LIMIT} left today</p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/[0.08]">
                <div
                  className="h-full rounded-full bg-charcoal transition-[width] duration-300"
                  style={{ width: `${Math.min(100, ((credits?.used ?? 0) / CREDITS_LIMIT) * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-[11.5px] text-dim-gray">Daily credits reset at midnight UTC.</p>
            </div>

            <h2 className="mt-10 text-[19px] font-medium tracking-tight">Workspace access</h2>
            <div className="mt-4 rounded-3xl border border-linen-border bg-warm-sand/60 p-5 md:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[14.5px] font-medium tracking-tight">Transfer primary ownership</p>
                  <p className="mt-0.5 max-w-md text-[13px] text-dim-gray">
                    Choose an active workspace member, or enter the email of another Lovable account.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/admin?tab=members")}
                  className="rounded-buttons border border-linen-border bg-parchment px-4 py-2 text-[13px] font-medium text-charcoal transition-colors hover:bg-black/[0.04]"
                >
                  Transfer
                </button>
              </div>
              <div className="mt-5 h-px bg-linen-border" />
              <div className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[14.5px] font-medium tracking-tight">Leave workspace</p>
                  <p className="mt-0.5 max-w-md text-[13px] text-dim-gray">
                    You cannot leave your last workspace. Your account must be a member of at least one workspace.
                  </p>
                </div>
                <button
                  type="button"
                  disabled
                  className="rounded-buttons border border-linen-border bg-parchment px-4 py-2 text-[13px] font-medium text-dim-gray opacity-60"
                  title="You cannot leave your last workspace"
                >
                  Leave workspace
                </button>
              </div>
            </div>

            <div className="h-16" />
          </section>
        </div>
      </main>
    </div>
  );
}

/** Sidebar + collapse state shared with the other dashboard surfaces. */
function AppSidebarWrapper() {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        setCollapsed(localStorage.getItem("lovable.sidebar-collapsed") === "1");
      } catch {}
    }, 0);
    const sync = () => {
      try {
        setCollapsed(localStorage.getItem("lovable.sidebar-collapsed") === "1");
      } catch {}
    };
    window.addEventListener("lovable:sidebar-changed", sync);
    return () => {
      clearTimeout(t);
      window.removeEventListener("lovable:sidebar-changed", sync);
    };
  }, []);
  return <AppSidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((c) => !c)} />;
}
