"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { templates, type Template } from "@/data/templates";
import { px } from "@/lib/img";

type FilterValue = string;

const CATEGORIES = ["All", "Websites", "Apps"] as const;

const SUBCATEGORIES: { label: string; slug: string }[] = [
  { label: "Portfolio", slug: "portfolio" },
  { label: "SaaS", slug: "saas" },
  { label: "Blog", slug: "blog" },
  { label: "Internal Tools", slug: "internal-tools" },
  { label: "Dashboards", slug: "dashboards" },
  { label: "Editorial", slug: "editorial" },
  { label: "Developer Tools", slug: "developer-tools" },
  { label: "Music", slug: "music" },
  { label: "Ecommerce", slug: "ecommerce" },
  { label: "Product Management", slug: "product-management" },
  { label: "Events", slug: "events" },
  { label: "Project Management", slug: "project-management" },
  { label: "Education", slug: "education" },
  { label: "Services", slug: "services" },
  { label: "Business Tools", slug: "business-tools" },
  { label: "Resume", slug: "resume" },
  { label: "Finance", slug: "finance" },
  { label: "Landing Page", slug: "landing-page" },
  { label: "Productivity", slug: "productivity" },
  { label: "Lifestyle", slug: "lifestyle" },
  { label: "Presentations", slug: "presentations" },
];

const PERSONAS: { label: string; subs: string[] }[] = [
  { label: "Founders", subs: ["saas", "business-tools", "landing-page"] },
  { label: "Marketers", subs: ["blog", "editorial", "landing-page"] },
  { label: "Designers", subs: ["portfolio"] },
  { label: "Salespeople", subs: ["internal-tools", "business-tools"] },
  { label: "Product managers", subs: ["product-management", "saas", "internal-tools"] },
  { label: "Operators", subs: ["internal-tools"] },
  { label: "HR teams", subs: ["internal-tools"] },
  { label: "Engineers", subs: ["developer-tools"] },
  { label: "Educators", subs: ["education"] },
  { label: "Students", subs: ["education", "productivity"] },
  { label: "Project managers", subs: ["project-management"] },
  { label: "Community builders", subs: ["events"] },
  { label: "Nonprofits", subs: ["services", "events"] },
  { label: "Media & publishers", subs: ["editorial", "blog"] },
];

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className ?? "h-4 w-4"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </svg>
  );
}

function SlidersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? "h-4 w-4"} fill="currentColor" aria-hidden="true">
      <path d="M15 13.25c1.8142 0 3.2332.9 4.0479 2.25.8157 1.35.9815 2.98.9416 4.5h.2605V12.2c0-1.2422-1.0088-2.25-2.25-2.25-.5812 0-1.1145.2205-1.5222.5787-.432.3797-.7353.925-.8834 1.5463C14.85 13.7186 14.6077 13.25 14.5091 13.25H13.5v7h1.25v-2H15z" />
    </svg>
  );
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? "h-4 w-4"} fill="currentColor" aria-hidden="true">
      <path d="M6.75 12c0 .9665-.7835 1.75-1.75 1.75S3.25 12.9665 3.25 12 4.0335 10.25 5 10.25 6.75 11.0335 6.75 12zM12.75 12c0 .9665-.7835 1.75-1.75 1.75S9.25 12.9665 9.25 12 10.0335 10.25 11 10.25s1.75.7835 1.75 1.75zM18.75 12c0 .9665-.7835 1.75-1.75 1.75S15.25 12.9665 15.25 12 16.0335 10.25 17 10.25s1.75.7835 1.75 1.75z" />
    </svg>
  );
}

function CheckBox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center overflow-hidden rounded-[3px] transition-colors ${
        checked ? "bg-charcoal" : "border border-black/20 bg-white"
      }`}
    >
      <svg
        viewBox="0 0 12 12"
        width="12"
        height="12"
        className={`h-3 w-3 ${checked ? "text-parchment" : "text-transparent"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.5 6 5 9l4.25-6" />
      </svg>
    </span>
  );
}

function TemplateModal({
  template,
  onClose,
  onRemix,
}: {
  template: Template;
  onClose: () => void;
  onRemix: (t: Template) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgb(3_3_3/0.55)] p-4"
      role="dialog"
      aria-modal="true"
      aria-label={template.title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="menu-pop relative w-full max-w-[760px] rounded-3xl bg-white p-6 shadow-subtle-2 sm:p-8">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-dim-gray transition-colors hover:bg-charcoal/5 hover:text-charcoal"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative overflow-hidden rounded-2xl border border-linen-border bg-warm-sand">
          <img src={px(template.img)} alt={template.title} className="aspect-[496/268] w-full object-cover object-top" />
          <button
            type="button"
            aria-label="Remix template"
            onClick={() => onRemix(template)}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-charcoal shadow-subtle transition-colors hover:bg-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path
                d="M12 19V5m0 0l-6 6m6-6l6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <h3 className="text-heading font-w480 text-charcoal">{template.title}</h3>
          <span className="rounded-lg bg-warm-sand px-2.5 py-1 text-xs text-dim-gray">{template.cat}</span>
        </div>
        <p className="mt-2 text-body text-dim-gray">{template.desc}</p>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-buttons border border-linen-border px-4 py-2.5 text-[15px] text-charcoal transition-colors hover:border-stone"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onRemix(template)}
            className="inline-flex items-center justify-center rounded-buttons bg-charcoal/88 px-4 py-2.5 text-[15px] text-parchment transition-colors hover:bg-charcoal"
          >
            Remix this template
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterItem({
  label,
  active,
  disabled,
  ticked,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  ticked?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`flex min-h-6 w-full items-center gap-3 text-sm text-left transition-colors ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:text-charcoal"
      } ${active ? "font-medium text-charcoal" : "font-normal text-dim-gray"}`}
    >
      {ticked && <CheckBox checked={active} />}
      <span className="truncate">{label}</span>
    </button>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const [category, setCategory] = useState<FilterValue>("All");
  const [sub, setSub] = useState<FilterValue>("All");
  const [persona, setPersona] = useState<FilterValue>("All");
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const byCat = useMemo(
    () => (category === "All" ? templates : templates.filter((t) => t.cat === category)),
    [category],
  );

  const q = query.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      byCat.filter((t) => {
        if (sub !== "All" && t.sub !== sub) return false;
        if (persona !== "All") {
          const p = PERSONAS.find((x) => x.label === persona);
          if (p && !p.subs.includes(t.sub)) return false;
        }
        if (q && !`${t.title} ${t.desc}`.toLowerCase().includes(q)) return false;
        return true;
      }),
    [byCat, sub, persona, q],
  );

  const subCount = (slug: string) => byCat.filter((t) => t.sub === slug).length;

  const personaCount = (p: { subs: string[] }) => byCat.filter((t) => p.subs.includes(t.sub)).length;

  const active = activeIdx === null ? null : filtered[activeIdx] ?? null;

  return (
    <>
      <main className="flex-1 bg-parchment">
        {/* Hero */}
        <hgroup className="mx-auto max-w-[700px] py-12 text-center">
          <div className="mb-4 min-h-5 flex justify-center" aria-hidden="true" />
          <h1 className="mb-2 flex flex-col items-center justify-center text-3xl font-w480 leading-tight text-charcoal md:text-5xl">
            <span className="pt-0.5 tracking-tight">Website and app templates</span>
            <span className="pt-0.5 tracking-tight">Built with AI</span>
          </h1>
          <p className="mx-auto mb-6 max-w-[50ch] text-center text-lg leading-tight text-charcoal/65 md:max-w-full md:text-xl">
            Production-ready apps from the Lovable community
          </p>

          {/* Search */}
          <div className="mx-auto mb-[50px] hidden w-full max-w-[700px] rounded-xl bg-white shadow-[0_0_0_1px_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.06),0_4px_12px_-2px_rgba(0,0,0,0.08),0_16px_28px_-12px_rgba(0,0,0,0.12)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#759eff] lg:flex">
            <div className="flex h-[60px] w-full items-center gap-1.5 px-4">
              <SearchIcon className="pointer-events-none size-5 shrink-0 text-smoke" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={"Search templates"}
                aria-label="Search templates"
                className="h-full w-full rounded-none bg-transparent text-[15px] text-charcoal placeholder:text-charcoal/40 outline-none"
              />
            </div>
          </div>
        </hgroup>

        {/* Main layout */}
        <section className="mx-auto grid w-full max-w-[1920px] grid-cols-1 gap-x-12 px-4 pb-16 lg:grid-cols-12 lg:px-12 lg:pb-24">
          {/* Results toolbar */}
          <div className="mb-11 bg-parchment py-3 lg:sticky lg:top-16 lg:z-10 lg:col-span-12">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-charcoal">{filtered.length} results</span>
            </div>
          </div>

          {/* Mobile filters toggle */}
          <div className="flex items-center gap-3 py-2 lg:hidden">
            <button
              type="button"
              aria-expanded={showFilters}
              onClick={() => setShowFilters((v) => !v)}
              className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-white px-2.5 py-1.5 text-sm text-charcoal shadow-sm ring-1 ring-black/5 transition-colors hover:ring-black/10"
            >
              <SlidersIcon className="h-4 w-4" />
              Filters
            </button>
            <span className="text-sm text-dim-gray">{filtered.length} results</span>
          </div>

          {/* Filters sidebar */}
          <nav
            aria-label="Template filters"
            className={`self-start overflow-y-auto pb-9 lg:sticky lg:top-20 lg:col-span-2 lg:block lg:max-h-[calc(100vh-5rem)] ${
              showFilters ? "block" : "hidden"
            }`}
          >
            <a href="#template-grid" className="sr-only focus:not-sr-only">
              Skip to templates
            </a>

            <div className="mb-8">
              <p className="mb-4 text-sm font-medium capitalize text-charcoal">Category</p>
              <ul role="list" className="space-y-1">
                {CATEGORIES.map((c) => (
                  <li key={c}>
                    <FilterItem
                      label={c}
                      active={category === c}
                      onClick={() => {
                        setCategory(c);
                        setActiveIdx(null);
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <p className="mb-4 text-sm font-medium capitalize text-charcoal">Subcategory</p>
              <ul role="list" className="space-y-1">
                {SUBCATEGORIES.map((s) => {
                  const count = subCount(s.slug);
                  return (
                    <li key={s.slug}>
                      <FilterItem
                        label={s.label}
                        ticked
                        active={sub === s.slug}
                        disabled={count === 0}
                        onClick={() => {
                          setSub(sub === s.slug ? "All" : s.slug);
                          setActiveIdx(null);
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mb-8">
              <p className="mb-4 text-sm font-medium capitalize text-charcoal">Persona</p>
              <ul role="list" className="space-y-1">
                {PERSONAS.map((p) => {
                  const count = personaCount(p);
                  return (
                    <li key={p.label}>
                      <FilterItem
                        label={p.label}
                        ticked
                        active={persona === p.label}
                        disabled={count === 0}
                        onClick={() => {
                          setPersona(persona === p.label ? "All" : p.label);
                          setActiveIdx(null);
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Grid */}
          <div className="lg:col-span-10">
            <div id="template-grid" className="scroll-mt-24">
              <section aria-label="All templates" className="mb-12">
                <h2 className="mb-8 text-lg font-medium text-charcoal lg:text-xl">
                  All templates
                  <span className="text-dim-gray"> ({filtered.length})</span>
                </h2>

                {filtered.length === 0 ? (
                  <p className="text-body text-dim-gray">No templates match these filters yet.</p>
                ) : (
                  <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                    {filtered.map((t, i) => (
                      <li key={t.img}>
                        <article aria-label={t.title} className="group/project-card relative flex flex-col">
                          <div className="relative mb-2 aspect-video">
                            <button
                              type="button"
                              aria-label={t.title}
                              onClick={() => setActiveIdx(i)}
                              className="relative isolate block aspect-video w-full overflow-hidden rounded-xl bg-[#f1f0ea] transition-[filter] after:pointer-events-none after:absolute after:inset-0 after:z-20 after:rounded-[inherit] after:border after:border-black/16 after:content-[''] hover:brightness-95 active:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#759eff]"
                            >
                              <img
                                src={px(t.img)}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                draggable="false"
                                className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-150 ease-in-out hover:opacity-80"
                              />
                            </button>
                          </div>

                          <div className="flex justify-between">
                            <button
                              type="button"
                              onClick={() => setActiveIdx(i)}
                              className="flex min-w-0 max-w-full flex-1 items-center gap-2 overflow-hidden text-left"
                            >
                              <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                                <span className="truncate font-normal text-charcoal">{t.title}</span>
                                <span className="truncate text-sm text-smoke">{t.desc}</span>
                              </div>
                            </button>
                            <div className="ml-2 hidden items-center gap-1 md:mx-4 md:flex">
                              <span className="rounded-lg bg-[#e9e8e3] px-3 py-2 text-xs text-smoke shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(255,255,255,0.6),0_1px_2px_-1px_rgba(0,0,0,0.08)] transition-colors hover:text-charcoal">
                                {t.cat}
                              </span>
                            </div>
                            <div className="ml-2 flex items-center">
                              <button
                                type="button"
                                aria-label={`More options for ${t.title}`}
                                onClick={() => setActiveIdx(i)}
                                className="flex h-7 w-7 items-center justify-center rounded-xl text-dim-gray transition-opacity group-focus-within/project-card:opacity-100 group-hover/project-card:opacity-100 lg:opacity-0"
                              >
                                <MoreIcon className="size-4" />
                              </button>
                            </div>
                          </div>
                        </article>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        </section>
      </main>
      {active && (
        <TemplateModal
          template={active}
          onClose={() => setActiveIdx(null)}
          onRemix={(t) => {
            setActiveIdx(null);
            router.push(`/new?q=${encodeURIComponent(`Remix the ${t.title} template`)}`);
          }}
        />
      )}
    </>
  );
}