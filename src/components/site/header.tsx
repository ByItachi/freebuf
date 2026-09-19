"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LovableLogo } from "@/components/brand";

/* ---------- thin 1.5px outlined icons (design-system spec) ---------- */

type IconProps = { className?: string };
const iconBase = "h-[18px] w-[18px]";
const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

const RocketIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${iconBase} ${className ?? ""}`} {...stroke}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const BuildingIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${iconBase} ${className ?? ""}`} {...stroke}>
    <rect x="4" y="3" width="16" height="18" rx="1.5" />
    <path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01" />
  </svg>
);

const BriefcaseIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${iconBase} ${className ?? ""}`} {...stroke}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
  </svg>
);

const PenIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${iconBase} ${className ?? ""}`} {...stroke}>
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </svg>
);

const LayoutIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${iconBase} ${className ?? ""}`} {...stroke}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);

const MegaphoneIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${iconBase} ${className ?? ""}`} {...stroke}>
    <path d="M3 11l18-7-4 14-6-3-3 4-1-6-4-2z" />
  </svg>
);

const BookIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${iconBase} ${className ?? ""}`} {...stroke}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />
    <path d="M20 22H6.5a2.5 2.5 0 0 1 0-5H20v5z" />
  </svg>
);

const TemplateIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${iconBase} ${className ?? ""}`} {...stroke}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ChatIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${iconBase} ${className ?? ""}`} {...stroke}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const HeartIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${iconBase} ${className ?? ""}`} {...stroke}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" />
  </svg>
);

const HelpIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${iconBase} ${className ?? ""}`} {...stroke}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
  </svg>
);

const SparkleIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${iconBase} ${className ?? ""}`} {...stroke}>
    <path d="M12 3l1.9 5.7a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z" />
  </svg>
);

const TargetIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${iconBase} ${className ?? ""}`} {...stroke}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

/* ---------- menu content ---------- */

type MenuItem = {
  title: string;
  desc: string;
  href: string;
  icon: (props: IconProps) => React.ReactElement;
};

const solutionsMenu: MenuItem[] = [
  { title: "For Work", desc: "Run on what you build.", href: "/for-work", icon: BriefcaseIcon },
  { title: "Founders", desc: "Ship before you pitch.", href: "/founders", icon: RocketIcon },
  { title: "Product managers", desc: "Prototype, don't spec.", href: "/product-managers", icon: LayoutIcon },
  { title: "Designers", desc: "Your designs, built.", href: "/designers", icon: PenIcon },
  { title: "Marketers", desc: "Launch pages in minutes.", href: "/marketers", icon: MegaphoneIcon },
  { title: "Sales", desc: "Build the demo live.", href: "/sales", icon: TargetIcon },
  { title: "Ops", desc: "Tools that fit your flow.", href: "/ops", icon: BuildingIcon },
  { title: "People", desc: "HR tools your team loves.", href: "/people", icon: BuildingIcon },
  { title: "Websites", desc: "From idea to live site.", href: "/use-cases/websites", icon: LayoutIcon },
  { title: "Prototyping", desc: "Proof of concept in hours.", href: "/prototypes", icon: RocketIcon },
  { title: "Internal tools", desc: "Built for your team.", href: "/tools", icon: BuildingIcon },
];

const resourcesMenu: MenuItem[] = [
  { title: "Blog", desc: "Ideas, updates, stories.", href: "/blog", icon: BookIcon },
  { title: "Partners", desc: "Build more together.", href: "/partners", icon: HeartIcon },
  { title: "Templates", desc: "Begin with a template.", href: "/templates", icon: TemplateIcon },
  { title: "Guides", desc: "Learn as you build.", href: "/guides", icon: SparkleIcon },
  { title: "Connectors", desc: "Build from what you already use.", href: "/connect", icon: ChatIcon },
  { title: "Academy", desc: "Learn to build with Lovable.", href: "https://academy.lovable.app/", icon: BookIcon },
  { title: "Docs", desc: "Everything under the hood.", href: "https://docs.lovable.dev/introduction/welcome", icon: HelpIcon },
  { title: "Customer stories", desc: "See what teams have built.", href: "/customers", icon: HeartIcon },
];

/* ---------- header ---------- */

const plainLinks = [
  { label: "Community", href: "/community" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Pricing", href: "/pricing" },
  { label: "Security", href: "/security" },
];

type MenuId = "solutions" | "resources" | null;

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3 w-3 opacity-70 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 3.5l3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MegaPanel({ items, open, variant }: { items: MenuItem[]; open: boolean; variant?: "solutions" | "resources" }) {
  if (!open) return null;
  const isResources = variant === "resources";
  const isSolutions = variant === "solutions";
  if (isResources) {
    const left = items.slice(0, 4);
    const right = items.slice(4);
    return (
      <div className="menu-pop absolute left-0 top-full z-50 pt-2">
        <div className="flex gap-3 rounded-2xl border border-linen-border bg-parchment p-2 shadow-subtle-2">
          <div className="flex gap-3">
            <div className="px-5 pt-8 pb-6">
              <div className="text-steel ml-3 text-xs">Resources</div>
              <div className="mt-2.5 flex gap-3">
                <ul className="flex w-[244px] flex-col gap-y-0.5 pr-1">
                  {left.map((item) => (
                    <li key={item.title}>
                      <Link href={item.href} className="group flex flex-col rounded-xl px-3 pt-[7px] pb-[9px] transition-colors hover:bg-warm-sand">
                        <span className="block text-[15px] font-medium text-charcoal">{item.title}</span>
                        <span className="text-sm text-dim-gray">{item.desc}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="flex w-[244px] flex-col gap-y-0.5 pr-1">
                  {right.map((item) => (
                    <li key={item.title}>
                      <Link href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined} className="group flex flex-col rounded-xl px-3 pt-[7px] pb-[9px] transition-colors hover:bg-warm-sand">
                        <span className="flex items-center gap-1.5 text-[15px] font-medium text-charcoal">
                          {item.title}
                          {item.href.startsWith("http") && (
                            <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-60" fill="currentColor" aria-hidden="true"><path d="M11.25 19V6.8L7.53 10.53a.75.75 0 01-1.06-1.06L11.47 4.47a.75.75 0 011.06 0l5 5a.75.75 0 01-1.06 1.06L12.75 6.8V19a.75.75 0 01-.75.75.75.75 0 01-.75-.75z" /></svg>
                          )}
                        </span>
                        <span className="text-sm text-dim-gray">{item.desc}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-l border-linen-border px-5 pt-8 pb-6">
              <div className="text-steel ml-3 text-xs">Announcement</div>
              <Link href="/blog/introducing-lovable-partner-program" className="group mt-2.5 block w-[244px]">
                <div className="flex flex-col gap-4 px-3 py-2">
                  <div className="relative aspect-video overflow-hidden rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5">
                    <img src="https://lovable.dev/cdn-cgi/image/width=640,f=auto,fit=scale-down/https://assets.lovable.dev/content/news/covers/introducing-lovable-partner-program.png" alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-charcoal">Introducing the Lovable Partner Program</div>
                    <div className="mt-1 flex items-center gap-1 text-sm text-steel">Learn more <span aria-hidden="true">→</span></div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (isSolutions) {
    const whoLeft = items.slice(0, 4);
    const whoRight = items.slice(4, 8);
    const useCases = items.slice(8);
    return (
      <div className="menu-pop absolute left-0 top-full z-50 pt-2">
        <div className="flex gap-3 rounded-2xl border border-linen-border bg-parchment p-2 shadow-subtle-2">
          <div className="px-5 pt-8 pb-6">
            <div className="text-steel ml-3 text-xs">Who is it for?</div>
            <div className="mt-2.5 flex gap-3">
              <ul className="flex w-[244px] flex-col gap-y-0.5 pr-1">
                {whoLeft.map((item) => (
                  <li key={item.title}>
                    <Link href={item.href} className="group flex flex-col rounded-xl px-3 pt-[7px] pb-[9px] transition-colors hover:bg-warm-sand">
                      <span className="block text-[15px] font-medium text-charcoal">{item.title}</span>
                      <span className="text-sm text-dim-gray">{item.desc}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="flex w-[244px] flex-col gap-y-0.5 pr-1">
                {whoRight.map((item) => (
                  <li key={item.title}>
                    <Link href={item.href} className="group flex flex-col rounded-xl px-3 pt-[7px] pb-[9px] transition-colors hover:bg-warm-sand">
                      <span className="block text-[15px] font-medium text-charcoal">{item.title}</span>
                      <span className="text-sm text-dim-gray">{item.desc}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="px-5 pt-8 pb-6">
            <div className="text-steel ml-3 text-xs">Use cases</div>
            <div className="mt-2.5 flex gap-3">
              <ul className="flex w-[244px] flex-col gap-y-0.5 pr-1">
                {useCases.map((item) => (
                  <li key={item.title}>
                    <Link href={item.href} className="group flex flex-col rounded-xl px-3 pt-[7px] pb-[9px] transition-colors hover:bg-warm-sand">
                      <span className="block text-[15px] font-medium text-charcoal">{item.title}</span>
                      <span className="text-sm text-dim-gray">{item.desc}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="menu-pop absolute left-0 top-full z-50 pt-2">
      <div className="grid w-[560px] grid-cols-2 gap-1 rounded-2xl border border-linen-border bg-parchment p-2 shadow-subtle-2">
        {items.map((item) => (
          <Link key={item.title} href={item.href} className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-warm-sand">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warm-sand text-charcoal group-hover:bg-parchment"><item.icon /></span>
            <span><span className="block text-[15px] font-w480 text-charcoal">{item.title}</span><span className="mt-0.5 block text-[13px] leading-snug text-dim-gray">{item.desc}</span></span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-2 pb-1 pt-4 text-[12px] font-semibold uppercase tracking-wide text-dim-gray">
        {label}
      </p>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

/** Stacked nav shown under the header below the lg breakpoint. */
function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  const rowClass =
    "rounded-lg px-2 py-2.5 text-[15px] text-charcoal transition-colors hover:bg-warm-sand";

  return (
    <div className="menu-pop absolute inset-x-0 top-full z-40 max-h-[calc(100dvh-3rem)] overflow-y-auto border-b border-linen-border bg-parchment px-4 pb-5 shadow-subtle-2 lg:hidden">
      <nav aria-label="Mobile navigation">
        <MobileGroup label="Solutions">
          {solutionsMenu.map((item) => (
            <Link key={item.title} href={item.href} onClick={onNavigate} className={rowClass}>
              {item.title}
            </Link>
          ))}
        </MobileGroup>
        <MobileGroup label="Resources">
          {resourcesMenu.map((item) => (
            <Link key={item.title} href={item.href} onClick={onNavigate} className={rowClass}>
              {item.title}
            </Link>
          ))}
        </MobileGroup>
        <MobileGroup label="Explore">
          {plainLinks.map((link) => (
            <Link key={link.label} href={link.href} onClick={onNavigate} className={rowClass}>
              {link.label}
            </Link>
          ))}
        </MobileGroup>
      </nav>
      <div className="mt-5 flex items-center gap-2.5">
        <Link
          href="/login"
          onClick={onNavigate}
          className="flex-1 rounded-buttons border border-linen-border px-3 py-2 text-center text-[15px] text-charcoal transition-colors hover:border-stone"
        >
          Log in
        </Link>
        <Link
          href="/new"
          onClick={onNavigate}
          className="flex-1 rounded-buttons bg-black px-3 py-2 text-center text-[15px] font-semibold text-white transition-colors hover:bg-charcoal"
        >
          Get started
        </Link>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<MenuId>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (pathname?.startsWith("/dashboard")) return null;

  const openMenu = (id: MenuId) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(id);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  };
  const toggleMenu = (id: MenuId) => setOpen((cur) => (cur === id ? null : id));

  const dropdownLink =
    "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[15px] font-semibold text-charcoal transition-colors hover:bg-charcoal/5 hover:text-ink";

  return (
    <header
      onMouseLeave={scheduleClose}
      className={`sticky top-0 z-50 transition-colors ${
        scrolled || mobileOpen
          ? "border-b border-linen-border bg-[rgba(255,255,255,0.8)] backdrop-blur-[4px]"
          : "bg-transparent"
      }`}
    >
      <div className="contain flex h-12 items-center gap-8">
        <Link href="/" aria-label="Lovable" className="hover-heartbeat flex w-fit items-center text-charcoal">
          <LovableLogo />
        </Link>

        <nav className="hidden flex-1 items-center gap-6 lg:flex">
          <div className="relative" onMouseEnter={() => openMenu("solutions")}>
            <button
              type="button"
              aria-expanded={open === "solutions"}
              aria-haspopup="true"
              onClick={() => toggleMenu("solutions")}
              className={dropdownLink}
            >
              Solutions
              <Caret open={open === "solutions"} />
            </button>
            <MegaPanel items={solutionsMenu} open={open === "solutions"} variant="solutions" />
          </div>

          <div className="relative" onMouseEnter={() => openMenu("resources")}>
            <button
              type="button"
              aria-expanded={open === "resources"}
              aria-haspopup="true"
              onClick={() => toggleMenu("resources")}
              className={dropdownLink}
            >
              Resources
              <Caret open={open === "resources"} />
            </button>
            <MegaPanel items={resourcesMenu} open={open === "resources"} variant="resources" />
          </div>

          {plainLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="inline-flex items-center px-2 py-1 text-[15px] font-semibold text-charcoal transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <Link
            href="/login"
            className="hidden rounded-buttons border border-linen-border px-2.5 py-1.5 text-[15px] text-charcoal transition-colors hover:border-stone sm:block"
          >
            Log in
          </Link>
          <Link
            href="/new"
            className="rounded-buttons bg-black px-2.5 py-1.5 text-[15px] font-semibold text-white transition-colors hover:bg-charcoal"
          >
            Get started
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-charcoal/5 lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {mobileOpen && <MobileMenu onNavigate={() => setMobileOpen(false)} />}
    </header>
  );
}
