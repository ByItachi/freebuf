"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FolderKanban,
  Gift,
  Home,
  LogOut,
  Mail,
  Plug,
  Plus,
  Search,
  Settings,
  Star,
  UserRound,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, type DashboardUser } from "@/lib/use-user";
import { recentProjectIds, isProjectHidden } from "@/lib/recents";
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

function LovableHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id="lovable-heart-dash" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#82bcff" />
          <stop offset="35%" stopColor="#2483ff" />
          <stop offset="55%" stopColor="#ff66f4" />
          <stop offset="75%" stopColor="#ff3029" />
          <stop offset="100%" stopColor="#fe7b02" />
        </linearGradient>
      </defs>
      <path
        fill="url(#lovable-heart-dash)"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  );
}

const DAILY_CREDITS = 5;

function WorkspaceMenu({
  user,
  initials,
  onClose,
}: {
  user: DashboardUser | null;
  initials: string;
  onClose: () => void;
}) {
  const menuItemCls =
    "flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] text-charcoal hover:bg-black/[0.04]";
  return (
    <div
      role="menu"
      className="absolute left-0 top-full z-50 mt-1 w-60 overflow-hidden rounded-2xl border border-linen-border bg-parchment shadow-lg"
    >
      {/* identity header */}
      <div className="flex items-center gap-2.5 border-b border-linen-border px-3 py-3">
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
            {initials || "RD"}
          </span>
        )}
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-medium tracking-tight text-charcoal">
            {user?.name ?? "Refero Design"}
          </span>
          <span className="block truncate text-[11.5px] text-dim-gray">
            Free Plan • 1 member
          </span>
        </span>
      </div>

      <div className="p-1.5">
        <Link href="/dashboard/settings" onClick={onClose} className={menuItemCls}>
          <UserRound className="size-3.5" /> Invite members
        </Link>
        <Link href="/dashboard/settings" onClick={onClose} className={menuItemCls}>
          <Settings className="size-3.5" /> Settings
        </Link>

        <div className="my-1.5 h-px bg-linen-border" />

        {/* credits card — mirrors Lovable's workspace menu */}
        <Link href="/settings/billing" onClick={onClose} className="group/credits block">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-[13px] font-medium tracking-tight text-charcoal">Credits</span>
            <span className="flex items-center gap-0.5 text-[12px] text-dim-gray">
              {DAILY_CREDITS} left
              <ChevronRight className="size-3.5 transition-transform motion-safe:group-hover/credits:translate-x-0.5" />
            </span>
          </div>
          <div className="mx-3 mb-2 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
            <div
              className="h-full rounded-full bg-blue-600 transition-[width] duration-150"
              style={{ width: `${Math.max(4, (DAILY_CREDITS / DAILY_CREDITS) * 100)}%` }}
            />
          </div>
          <p className="px-3 pb-2.5 text-[11px] text-dim-gray">Daily credits reset at midnight UTC</p>
        </Link>

        <div className="my-1.5 h-px bg-linen-border" />

        <button type="button" className={`${menuItemCls} w-full text-left`} disabled>
          <Plus className="size-3.5" /> New workspace
        </button>

        <div className="my-1.5 h-px bg-linen-border" />

        <div className="flex items-center gap-2 px-3 py-2">
          <Zap className="size-3.5 text-[#7c3aed]" />
          <span className="flex-1 text-[13px] text-charcoal">Turn Pro</span>
          <Link
            href="/pricing"
            onClick={onClose}
            className="rounded-full bg-black/90 px-2.5 py-1 text-[11.5px] font-medium text-parchment transition-opacity hover:opacity-90"
          >
            Upgrade
          </Link>
        </div>

        <div className="my-1.5 h-px bg-linen-border" />

        <Link href="/" onClick={onClose} className={menuItemCls}>
          <LogOut className="size-3.5" /> Sign out
        </Link>
      </div>
    </div>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Recent[]>([]);
  const [recents, setRecents] = useState<Recent[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [connectorsOpen, setConnectorsOpen] = useState(false);
  const { user, initials } = useUser();
  const workspaceRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

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
      }
      if (accountOpen && accountRef.current && !accountRef.current.contains(t)) {
        setAccountOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, accountOpen]);

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

  return (
    <aside className="dash-sidebar fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-linen-border bg-parchment md:flex">
      <div className="flex items-center gap-2 px-4 pb-3 pt-4">
        <LovableHeart className="size-6 shrink-0 transition-transform duration-300 hover:scale-110" />
        <div ref={workspaceRef} className="relative min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex w-full min-w-0 items-center gap-1.5 rounded-lg px-1 py-1 text-left transition-colors hover:bg-black/[0.03]"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#82bcff] via-[#ff66f4] to-[#fe7b02] text-[9.5px] font-medium text-parchment">
              {initials || "RD"}
            </span>
            <span className="truncate text-[13.5px] font-medium tracking-tight text-charcoal">
              {user?.name ?? "Refero Design"}
            </span>
            <ChevronDown className="size-3.5 shrink-0 text-dim-gray" />
          </button>
          {menuOpen ? (
            <WorkspaceMenu user={user} initials={initials} onClose={() => setMenuOpen(false)} />
          ) : null}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-3 pb-3">
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

      <div className="mt-auto flex flex-col gap-2 border-t border-linen-border px-3 py-3">
        {/* stacked promo cards — Upgrade slides UP out of the stack on hover,
            revealing the Share card beneath it */}
        <div className="group/promos relative h-16 w-full">
          <Link
            href="/settings/billing#plans"
            className="absolute inset-x-0 top-0 z-10 flex h-16 items-center justify-between gap-3 rounded-2xl border border-linen-border bg-warm-sand px-3 text-left transition-all duration-200 ease-out group-hover/promos:-translate-y-2 group-hover/promos:scale-[0.97] group-hover/promos:opacity-0 group-hover/promos:pointer-events-none"
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

          <Link
            href="/dashboard/settings"
            className="absolute inset-x-0 top-0 z-0 flex h-16 translate-y-3 scale-[0.97] items-center justify-between gap-3 rounded-2xl border border-linen-border bg-warm-sand px-3 text-left opacity-0 transition-all duration-200 ease-out group-hover/promos:translate-y-0 group-hover/promos:scale-100 group-hover/promos:opacity-100"
          >
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium tracking-tight text-charcoal">
                Share Lovable
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
              <div className="absolute bottom-full left-0 z-50 mb-2 w-48 rounded-2xl border border-linen-border bg-parchment p-1.5 shadow-lg">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] text-charcoal hover:bg-black/[0.04]"
                >
                  <Settings className="size-3.5" /> Settings
                </Link>
                <Link
                  href="/"
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] text-charcoal hover:bg-black/[0.04]"
                >
                  <LogOut className="size-3.5" /> Sign out
                </Link>
              </div>
            ) : null}
          </div>
          <Link
            href="/dashboard/settings"
            className="flex size-8 items-center justify-center rounded-full text-dim-gray transition-colors hover:bg-black/[0.04] hover:text-charcoal"
            aria-label="Messages and keys"
          >
            <Mail className="size-4" />
          </Link>
        </div>
      </div>

      <ConnectorsDrawer open={connectorsOpen} onClose={() => setConnectorsOpen(false)} />
    </aside>
  );
}

export default AppSidebar;
