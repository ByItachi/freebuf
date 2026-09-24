"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  FolderKanban,
  Gift,
  Home,
  Inbox,
  LifeBuoy,
  LogOut,
  Monitor,
  Moon,
  PanelLeftClose,
  Plug,
  Search,
  Settings,
  SquarePen,
  Settings2,
  Star,
  Sun,
  UserRound,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, type DashboardUser } from "@/lib/use-user";
import { recentProjectIds, isProjectHidden } from "@/lib/recents";
import { readCredits, remainingCredits, CREDITS_LIMIT } from "@/lib/credits";
import { USER_STORAGE_KEY } from "@/lib/use-user";
import { ConnectorsDrawer } from "@/components/app/connectors-drawer";
import { ProjectActionsMenu } from "@/components/app/project-actions-menu";

const primaryNav = [
  { href: "/dashboard/resources", label: "Resources", icon: BookOpen },
  { href: "/dashboard/platform", label: "Platform", icon: BookOpen },
  { href: "/dashboard/connectors", label: "Connectors", icon: Plug },
] as const;

const projectNav = [
  { href: "/dashboard/projects", label: "All projects", icon: FolderKanban },
  { href: "/dashboard/created-by-me", label: "My projects", icon: UserRound },
  { href: "/dashboard/shared-with-me", label: "Shared projects", icon: Users },
] as const;

type Recent = { id: string; name: string; starred: boolean; published?: boolean };

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick?: () => void;
}) {
  const cls = cn(
    "dash-nav-item flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-[13.5px] tracking-tight",
    active
      ? "bg-black/[0.06] font-medium text-ink"
      : "text-dim-gray hover:bg-black/[0.03] hover:text-charcoal",
  );
  const inner = (
    <>
      <Icon className="size-[15px] shrink-0 opacity-80" />
      <span className="truncate">{label}</span>
    </>
  );
  if (!href) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {inner}
      </button>
    );
  }
  return (
    <Link href={href} onClick={onClick} className={cls}>
      {inner}
    </Link>
  );
}

function FreebuffGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 180" className={className} aria-hidden>
      <defs>
        <linearGradient id="freebuff-glyph-dash" x1="12" y1="8" x2="168" y2="172" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4ADE80" />
          <stop offset="0.55" stopColor="#22C55E" />
          <stop offset="1" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <rect width="180" height="180" rx="44" fill="url(#freebuff-glyph-dash)" />
      <path d="M103 22 L52 98 H84 L76 158 L128 78 H95 L103 22 Z" fill="#04121F" />
    </svg>
  );
}

type ThemeChoice = "light" | "dark" | "system";

function readStoredTheme(): ThemeChoice {
  if (typeof window === "undefined") return "light";
  try {
    const v = localStorage.getItem("freebuff.theme");
    return v === "dark" || v === "system" ? v : "light";
  } catch {
    return "light";
  }
}

/** Resolves the effective theme and applies/removes data-theme on <html>. */
function useTheme() {
  const [choice, setChoice] = useState<ThemeChoice>(() => readStoredTheme());

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    const apply = () => {
      // Freebuff is dark-first: dark is the default (no attribute) and the
      // light parchment variant is opt-in via data-theme="light".
      const dark = choice === "dark" || (choice === "system" && mq?.matches);
      if (dark) {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }
    };
    apply();
    mq?.addEventListener?.("change", apply);
    return () => mq?.removeEventListener?.("change", apply);
  }, [choice]);

  const setTheme = useCallback((next: ThemeChoice) => {
    setChoice(next);
    try {
      localStorage.setItem("freebuff.theme", next);
    } catch {}
  }, []);

  return { choice, setTheme };
}

function ThemeSubmenu({
  choice,
  onPick,
  placement = "cascade",
}: {
  choice: ThemeChoice;
  onPick: (t: ThemeChoice) => void;
  /** "cascade" opens to the right (AccountMenu); "above" opens upward (bottom bar). */
  placement?: "cascade" | "above";
}) {
  const options: Array<{ value: ThemeChoice; label: string; icon: typeof Sun }> = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];
  return (
    <div
      role="menu"
      aria-label="Appearance"
      className={`dash-menu-pop-up absolute z-50 w-44 rounded-2xl border border-linen-border bg-parchment p-1.5 shadow-[0_16px_40px_-16px_rgba(28,28,28,0.35)] ${
        placement === "above" ? "bottom-full left-0 mb-2" : "left-full top-0 ml-1.5"
      }`}
    >
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="menuitemradio"
          aria-checked={choice === value}
          onClick={() => onPick(value)}
          className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-[13px] tracking-tight text-charcoal transition-colors hover:bg-black/[0.04]"
        >
          <Icon className="size-4 text-dim-gray" />
          {label}
          {choice === value ? <Check className="ml-auto size-4 text-charcoal" /> : null}
        </button>
      ))}
    </div>
  );
}

function SignOutDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign out"
        onClick={(e) => e.stopPropagation()}
        className="dash-menu-pop-up w-full max-w-sm rounded-3xl border border-linen-border bg-parchment p-5 shadow-[0_24px_60px_-24px_rgba(28,28,28,0.5)]"
      >
        <h2 className="text-[16px] font-medium tracking-tight text-charcoal">Sign out of Freebuff?</h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-dim-gray">
          Your projects stay safely in this workspace. You can sign back in anytime.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-linen-border bg-parchment px-4 py-2 text-[13px] font-medium text-charcoal transition-colors hover:bg-black/[0.04]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-charcoal px-4 py-2 text-[13px] font-medium text-parchment transition-colors hover:bg-charcoal/90"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function AccountMenu({
  user,
  initials,
  cascade,
  setCascade,
  theme,
  onPickTheme,
  signOutRequest,
  onClose,
}: {
  user: DashboardUser | null;
  initials: string;
  cascade: "closed" | "appearance" | "documentation";
  setCascade: (c: "closed" | "appearance" | "documentation") => void;
  theme: ThemeChoice;
  onPickTheme: (t: ThemeChoice) => void;
  signOutRequest: () => void;
  onClose: () => void;
}) {
  const itemCls =
    "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-[13px] tracking-tight text-charcoal transition-colors hover:bg-black/[0.04]";
  const submenuCls = `${itemCls} cursor-default`;

  return (
    <div
      role="menu"
      aria-orientation="vertical"
      className="dash-menu-pop-up absolute bottom-full left-0 z-50 mb-2 w-56 overflow-visible rounded-2xl border border-linen-border bg-parchment p-1.5 shadow-[0_16px_40px_-16px_rgba(28,28,28,0.35)]"
    >
      {/* identity row — avatar + email, like Freebuff's account menu */}
      <Link
        href="/dashboard/settings"
        onClick={onClose}
        className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-black/[0.04]"
      >
        {user?.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#82bcff] via-[#ff66f4] to-[#fe7b02] text-[11px] font-medium text-parchment">
            {initials || "GA"}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate text-[13px] font-medium tracking-tight text-charcoal">
          {user?.email ?? user?.name ?? "mylife12.gra@gmail.com"}
        </span>
      </Link>

      <div className="mx-1 my-1 h-px bg-linen-border" />

      <Link href="/dashboard/settings" onClick={onClose} className={itemCls}>
        <UserRound className="size-4 text-dim-gray" /> Profile
      </Link>
      <Link href="/dashboard/settings" onClick={onClose} className={itemCls}>
        <Inbox className="size-4 text-dim-gray" /> Inbox
        <span className="ml-auto mr-1 size-2 rounded-full bg-red-500" />
      </Link>
      <Link href="/dashboard/settings" onClick={onClose} className={itemCls}>
        <Settings className="size-4 text-dim-gray" /> Settings
        <span className="ml-auto hidden sm:flex items-center gap-0.5 text-[10px] text-dim-gray">
          <span className="rounded border border-linen-border bg-parchment px-1 py-0.5">Ctrl</span>
          <span className="rounded border border-linen-border bg-parchment px-1 py-0.5">.</span>
        </span>
      </Link>
      <div className="relative">
        <button
          type="button"
          className={submenuCls}
          aria-haspopup="menu"
          aria-expanded={cascade === "appearance"}
          onMouseEnter={() => setCascade("appearance")}
          onFocus={() => setCascade("appearance")}
          onClick={() => setCascade(cascade === "appearance" ? "closed" : "appearance")}
        >
          <Sun className="size-4 text-dim-gray" /> Appearance
          <ChevronRight className="ml-auto size-4 text-dim-gray" />
        </button>
        {cascade === "appearance" ? (
          <ThemeSubmenu choice={theme} onPick={onPickTheme} />
        ) : null}
      </div>

      <div className="mx-1 my-1 h-px bg-linen-border" />

      <div className="relative">
        <button
          type="button"
          className={submenuCls}
          aria-haspopup="menu"
          aria-expanded={cascade === "documentation"}
          onMouseEnter={() => setCascade("documentation")}
          onFocus={() => setCascade("documentation")}
          onClick={() => setCascade(cascade === "documentation" ? "closed" : "documentation")}
        >
          <BookOpen className="size-4 text-dim-gray" /> Documentation
          <ChevronRight className="ml-auto size-4 text-dim-gray" />
        </button>
        {cascade === "documentation" ? (
          <div
            role="menu"
            aria-label="Documentation"
            className="dash-menu-pop-up absolute left-full top-0 z-50 ml-1.5 w-48 rounded-2xl border border-linen-border bg-parchment p-1.5 shadow-[0_16px_40px_-16px_rgba(28,28,28,0.35)]"
          >
            <Link href="/guides" onClick={onClose} className={itemCls}>
              <BookOpen className="size-4 text-dim-gray" /> Documentation
            </Link>
            <Link href="/guides" onClick={onClose} className={itemCls}>
              <FileText className="size-4 text-dim-gray" /> Guides
            </Link>
            <Link href="/support" onClick={onClose} className={itemCls}>
              <LifeBuoy className="size-4 text-dim-gray" /> Help center
            </Link>
          </div>
        ) : null}
      </div>
      <a
        href="https://community.freebuff.dev"
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className={itemCls}
      >
        <Users className="size-4 text-dim-gray" /> Community
      </a>
      <Link href="/download" onClick={onClose} className={itemCls}>
        <Download className="size-4 text-dim-gray" /> Download apps
      </Link>
      <Link href="/" onClick={onClose} className={itemCls}>
        <Home className="size-4 text-dim-gray" /> Homepage
      </Link>

      <div className="mx-1 my-1 h-px bg-linen-border" />

      <button type="button" onClick={signOutRequest} className={itemCls}>
        <LogOut className="size-4 text-dim-gray" /> Sign out
      </button>
    </div>
  );
}

function WorkspaceMenu({
  onClose,
}: {
  onClose: () => void;
}) {
  // Freebuff's compact workspace popover: workspace header, Invite members,
  // Settings, the daily credits meter, and Turn Pro. All deeper settings
  // sections live on /settings/workspace.
  const { user, initials } = useUser();
  const [credits, setCredits] = useState(readCredits());
  useEffect(() => {
    const sync = () => setCredits(readCredits());
    window.addEventListener("freebuff:credits-changed", sync);
    return () => window.removeEventListener("freebuff:credits-changed", sync);
  }, []);
  const remaining = remainingCredits(credits);
  const usedPct = Math.min(100, Math.round((credits.used / CREDITS_LIMIT) * 100));

  const workspaceName = user?.name ?? "Gürkan's Freebuff";
  const itemCls =
    "flex w-full items-center justify-center gap-2 rounded-full border border-linen-border bg-parchment px-3 py-2.5 text-[13px] font-medium tracking-tight text-charcoal transition-colors hover:bg-black/[0.04]";

  return (
    <div
      role="menu"
      aria-orientation="vertical"
      className="dash-menu-pop-up absolute left-0 top-full z-50 mt-1.5 w-60 rounded-2xl border border-linen-border bg-parchment p-2 shadow-[0_16px_40px_-16px_rgba(28,28,28,0.35)]"
    >
      {/* Workspace header */}
      <Link href="/settings/workspace" onClick={onClose} className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-black/[0.04]">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-charcoal text-[10px] font-semibold text-parchment">
          {(initials || "G").slice(0, 1)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium tracking-tight text-charcoal">{workspaceName}</span>
          <span className="block truncate text-[11px] text-dim-gray">Free Plan · 1 member</span>
        </span>
      </Link>

      <Link href="/settings/workspace#invite" onClick={onClose} className={itemCls}>
        <UserRound className="size-4" /> Invite members
      </Link>
      <Link href="/settings/workspace" onClick={onClose} className={`${itemCls} mt-1.5`}>
        <Settings2 className="size-4" /> Settings
      </Link>

      <div className="mx-0 my-2 h-px bg-linen-border" />

      {/* Daily credits meter — real count of model calls sent from this browser */}
      <Link href="/settings/billing" onClick={onClose} className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-black/[0.04]">
        <span className="text-[13px] font-medium tracking-tight text-charcoal">Credits</span>
        <span className="text-[13px] text-dim-gray">{remaining} left</span>
        <ChevronRight className="size-3.5 text-dim-gray" />
      </Link>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/[0.08]">
        <div
          className="h-full rounded-full bg-charcoal transition-[width] duration-300"
          style={{ width: `${Math.max(remaining === 0 ? 100 : 0, usedPct)}%` }}
        />
      </div>
      <p className="mt-2 flex items-center gap-1.5 px-2 text-[11px] text-dim-gray">
        <span className="size-1.5 shrink-0 rounded-full bg-dim-gray/60" />
        Daily credits reset at midnight UTC
      </p>

      <div className="mx-0 my-2 h-px bg-linen-border" />

      <button
        type="button"
        onClick={onClose}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-black/[0.04]"
      >
        <Zap className="size-4 text-charcoal" />
        <span className="flex-1 text-[13px] font-medium tracking-tight text-charcoal">Turn Pro</span>
        <Link
          href="/settings/billing#plans"
          onClick={onClose}
          className="rounded-full border border-linen-border bg-parchment px-2.5 py-1 text-[11px] font-medium text-charcoal transition-colors hover:bg-black/[0.06]"
        >
          Upgrade
        </Link>
      </button>
    </div>
  );
}
export function AppSidebar({
  collapsed,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Recent[]>([]);
  const [recents, setRecents] = useState<Recent[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [connectorsOpen, setConnectorsOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [cascade, setCascade] = useState<"closed" | "appearance" | "documentation">("closed");
  const [signOutOpen, setSignOutOpen] = useState(false);
  const { user, initials, setUserName } = useUser();
  const { choice: theme, setTheme } = useTheme();
  const workspaceRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href || pathname === "/dashboard/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const loadRecents = useCallback(() => {
    fetch("/api/projects", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const projects: Array<Recent> = d.projects ?? [];
        const ids = recentProjectIds();
        const byId = new Map(projects.map((p) => [p.id, p]));
        const ordered = ids
          .map((id) => byId.get(id))
          .filter((p): p is Recent => Boolean(p))
          .slice(0, 3);
        const visible =
          ordered.length > 0
            ? ordered
            : projects.filter((p) => !isProjectHidden(p.id)).slice(0, 3);
        setRecents(visible);
      })
      .catch(() => {});
  }, []);

  // live recents from the project store, ordered by local view history
  useEffect(() => {
    loadRecents();
  }, [loadRecents, pathname]);

  // ⌘K / Ctrl+K focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // close dropdowns on outside click / Escape
  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (menuOpen && workspaceRef.current && !workspaceRef.current.contains(t)) {
        setMenuOpen(false);
        setCascade("closed");
      }
      if (accountOpen && accountRef.current && !accountRef.current.contains(t)) {
        setAccountOpen(false);
        setCascade("closed");
      }
      if (themeMenuOpen && themeRef.current && !themeRef.current.contains(t)) {
        setThemeMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (cascade !== "closed") {
          setCascade("closed");
          return;
        }
        setMenuOpen(false);
        setAccountOpen(false);
        setThemeMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, accountOpen, themeMenuOpen, cascade]);

  // live search across projects; Enter opens the first match
  useEffect(() => {
    const q = search.trim().toLowerCase();
    const t = setTimeout(() => {
      if (!q) {
        setSearchResults([]);
        return;
      }
      fetch("/api/projects", { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          const projects: Array<Recent> = d.projects ?? [];
          setSearchResults(
            projects.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5),
          );
        })
        .catch(() => {});
    }, 150);
    return () => clearTimeout(t);
  }, [search]);

  const gotoFirst = useCallback(() => {
    if (searchResults[0]) {
      router.push(`/projects/${searchResults[0].id}`);
      setSearch("");
    }
  }, [searchResults, router]);

  const requestSignOut = useCallback(() => {
    setMenuOpen(false);
    setAccountOpen(false);
    setSignOutOpen(true);
  }, []);

  const confirmSignOut = useCallback(() => {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {}
    setUserName("");
    setSignOutOpen(false);
    router.push("/login");
  }, [router, setUserName]);

  return (
    <aside
      className={`dash-sidebar fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-linen-border bg-parchment transition-[width] duration-200 md:flex ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Reference layout: mark alone on top; collapse toggle beside it.
          Collapsed state = icon rail; the mark itself becomes the expand button. */}
      {collapsed ? (
        <div className="flex justify-center px-2 pb-2 pt-4">
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label="Expand navigation"
            className="flex size-9 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-black/[0.04]"
          >
            <FreebuffGlyph className="size-6" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <FreebuffGlyph className="size-6 shrink-0 transition-transform duration-300 hover:scale-110" />
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label="Collapse navigation"
            className="flex size-8 items-center justify-center rounded-full text-dim-gray transition-colors hover:bg-black/[0.04] hover:text-charcoal"
          >
            <PanelLeftClose className="size-4" />
          </button>
        </div>
      )}

      {!collapsed ? (
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-3 pb-3">
        {/* Workspace name pill — its own row above Home */}
        <div ref={workspaceRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex w-full min-w-0 items-center gap-1.5 rounded-xl border border-linen-border bg-warm-sand px-2 py-1.5 text-left transition-colors hover:bg-warm-sand/70"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#82bcff] via-[#ff66f4] to-[#fe7b02] text-[9.5px] font-medium text-parchment">
              {initials || "RD"}
            </span>
            <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium tracking-tight text-charcoal">
              {user?.name ?? "Refero Design"}
            </span>
            <ChevronDown className="size-3.5 shrink-0 text-dim-gray" />
          </button>
          {menuOpen ? <WorkspaceMenu onClose={() => setMenuOpen(false)} /> : null}
        </div>

        <nav className="flex flex-col gap-0.5">
          <NavItem href="/dashboard" label="Home" icon={Home} active={isActive("/dashboard", true)} />
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
              <Search className="size-[15px] opacity-80 text-dim-gray" />
            </span>
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") gotoFirst();
                if (e.key === "Escape") setSearch("");
              }}
              placeholder="Search"
              aria-label="Search projects"
              className="dash-nav-item flex w-full items-center gap-2.5 rounded-full bg-black/[0.02] py-2 pl-9 pr-10 text-[13.5px] tracking-tight text-charcoal outline-none placeholder:text-dim-gray focus:bg-black/[0.05]"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-linen-border bg-parchment px-1.5 py-0.5 text-[10px] font-medium text-dim-gray">
              ⌘K
            </span>
            {searchResults.length > 0 ? (
              <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-2xl border border-linen-border bg-parchment p-1.5 shadow-lg">
                {searchResults.map((r) => (
                  <Link
                    key={r.id}
                    href={`/projects/${r.id}`}
                    onClick={() => setSearch("")}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] text-charcoal hover:bg-black/[0.04]"
                  >
                    <Search className="size-3.5 text-dim-gray" />
                    <span className="truncate">{r.name}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          {primaryNav.map((item) =>
            item.href === "/dashboard/connectors" ? (
              <NavItem
                key={item.href}
                label={item.label}
                icon={item.icon}
                active={connectorsOpen}
                onClick={() => setConnectorsOpen(true)}
              />
            ) : (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={isActive(item.href)}
              />
            ),
          )}
        </nav>

        <div>
          <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-wide text-dim-gray">
            Projects
          </p>
          <nav className="flex flex-col gap-0.5">
            {projectNav.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={isActive(item.href)}
              />
            ))}
          </nav>
        </div>

        <div>
          <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-wide text-dim-gray">
            Recents
          </p>
          <ul className="flex flex-col gap-0.5">
            {recents.map((r) => (
              <li key={r.id} className="group/recent relative flex items-center">
                <Link
                  href={`/projects/${r.id}`}
                  className="dash-nav-item flex min-w-0 flex-1 items-center gap-2 rounded-full py-2 pl-3 pr-2 text-[13px] tracking-tight text-dim-gray transition-[padding] group-hover/recent:pr-8 hover:bg-black/[0.03] hover:text-charcoal"
                >
                  <span className="size-2 shrink-0 rounded-full bg-gradient-to-br from-[#82bcff] via-[#ff66f4] to-[#fe7b02]" />
                  <span className="min-w-0 flex-1 truncate">{r.name}</span>
                  {r.starred ? <Star className="size-3.5 shrink-0 fill-charcoal text-charcoal" /> : null}
                </Link>
                <span className="absolute right-1 top-1/2 z-10 -translate-y-1/2 opacity-0 transition-opacity group-hover/recent:opacity-100 group-focus-within/recent:opacity-100">
                  <ProjectActionsMenu project={r} onChanged={loadRecents} />
                </span>
              </li>
            ))}
            {recents.length === 0 ? (
              <li className="px-3 py-2 text-[12px] text-dim-gray/70">No projects yet</li>
            ) : null}
          </ul>
        </div>
      </div>
      ) : null}

      {!collapsed ? (
      <div className="mt-auto flex flex-col gap-2 border-t border-linen-border px-3 py-3">
        {/* Stacked promo cards — Upgrade rests on top, Share sits underneath;
            hovering slides the Share card out DOWNWARD below the Upgrade card. */}
        {/* Promo stack expands UPWARD on hover: Upgrade slides up into the
            scroll area, Share takes over its bottom slot — the sidebar's bottom
            edge stays fixed and nothing gets clipped below it. */}
        <div className="group/promos relative h-16 w-full">
          <Link
            href="/settings/billing#plans"
            className="relative z-10 flex h-16 w-full items-center justify-between gap-3 rounded-2xl border border-linen-border bg-warm-sand px-3 text-left transition-all duration-200 ease-out group-hover/promos:-translate-y-[68px]"
          >
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium tracking-tight text-charcoal">
                Upgrade to Pro
              </span>
              <span className="block truncate text-[11.5px] leading-snug text-dim-gray">
                Unlock more features
              </span>
            </span>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black/[0.05]">
              <Zap className="size-4 text-[#7c3aed]" />
            </span>
          </Link>

          <div className="pointer-events-none absolute inset-x-0 top-0 z-0 translate-y-2 scale-[0.97] opacity-0 transition-all duration-200 ease-out group-hover/promos:pointer-events-auto group-hover/promos:translate-y-0 group-hover/promos:scale-100 group-hover/promos:opacity-100">
            <Link
              href="/dashboard/settings"
              className="flex h-16 w-full items-center justify-between gap-3 rounded-2xl border border-linen-border bg-warm-sand px-3 text-left"
            >
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-medium tracking-tight text-charcoal">
                  Share Freebuff
                </span>
                <span className="block truncate text-[11.5px] leading-snug text-dim-gray">
                  100 credits per paid referral
                </span>
              </span>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black/[0.05]">
                <Gift className="size-4 text-charcoal" />
              </span>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between px-1 pt-1">
          <div ref={accountRef} className="relative">
            <button
              type="button"
              onClick={() => setAccountOpen((v) => !v)}
              className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#82bcff] via-[#ff66f4] to-[#fe7b02] text-[11px] font-medium text-parchment shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-105"
              aria-label="Account menu"
              aria-expanded={accountOpen}
            >
              {initials || "GA"}
            </button>
            {accountOpen ? (
              <AccountMenu
                user={user}
                initials={initials}
                cascade={cascade}
                setCascade={setCascade}
                theme={theme}
                onPickTheme={setTheme}
                signOutRequest={requestSignOut}
                onClose={() => {
                  setAccountOpen(false);
                  setCascade("closed");
                }}
              />
            ) : null}
          </div>
          <div ref={themeRef} className="relative">
            <button
              type="button"
              onClick={() => setThemeMenuOpen((v) => !v)}
              aria-expanded={themeMenuOpen}
              aria-haspopup="menu"
              aria-label="Görünüm (tema)"
              className="flex size-8 items-center justify-center rounded-full text-dim-gray transition-colors hover:bg-black/[0.04] hover:text-charcoal"
            >
              {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </button>
            {themeMenuOpen ? (
              <ThemeSubmenu placement="above" choice={theme} onPick={setTheme} />
            ) : null}
          </div>
        </div>
      </div>
      ) : null}

      {/* Collapsed icon rail: mark (expand), New, Search, theme, account */}
      {collapsed ? (
      <div className="flex min-h-0 flex-1 flex-col items-center gap-1 overflow-y-auto px-2 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => router.push("/new")}
          aria-label="New chat"
          className="flex size-9 items-center justify-center rounded-full text-dim-gray transition-colors hover:bg-black/[0.04] hover:text-charcoal"
        >
          <SquarePen className="size-4" />
        </button>
        <Link
          href="/dashboard"
          aria-label="Search"
          className="flex size-9 items-center justify-center rounded-full text-dim-gray transition-colors hover:bg-black/[0.04] hover:text-charcoal"
        >
          <Search className="size-4" />
        </Link>
        <div className="mt-auto flex flex-col items-center gap-1 border-t border-linen-border w-full pt-2">
          <button
            type="button"
            onClick={() => setThemeMenuOpen((v) => !v)}
            aria-expanded={themeMenuOpen}
            aria-haspopup="menu"
            aria-label="Görünüm (tema)"
            className="relative flex size-9 items-center justify-center rounded-full text-dim-gray transition-colors hover:bg-black/[0.04] hover:text-charcoal"
          >
            {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            {themeMenuOpen ? (
              <ThemeSubmenu placement="above" choice={theme} onPick={setTheme} />
            ) : null}
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setAccountOpen((v) => !v)}
              aria-expanded={accountOpen}
              aria-label="Account menu"
              className="flex size-9 items-center justify-center rounded-full"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#82bcff] via-[#ff66f4] to-[#fe7b02] text-[11px] font-medium text-parchment">
                {initials || "GA"}
              </span>
            </button>
            {accountOpen ? (
              <AccountMenu
                user={user}
                initials={initials}
                cascade={cascade}
                setCascade={setCascade}
                theme={theme}
                onPickTheme={setTheme}
                signOutRequest={requestSignOut}
                onClose={() => {
                  setAccountOpen(false);
                  setCascade("closed");
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
      ) : null}

      <ConnectorsDrawer open={connectorsOpen} onClose={() => setConnectorsOpen(false)} />
      {signOutOpen ? (
        <SignOutDialog onCancel={() => setSignOutOpen(false)} onConfirm={confirmSignOut} />
      ) : null}
    </aside>
  );
}

export default AppSidebar;
