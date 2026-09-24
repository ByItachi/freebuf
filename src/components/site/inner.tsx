import Link from "next/link";
import type { ReactNode } from "react";

/* Shared kit for marketing inner pages (light parchment theme). */

export function InnerHero({
  eyebrow,
  title,
  sub,
  primary,
  secondary,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-10 pt-16 text-center md:pb-14 md:pt-24">
      {eyebrow && (
        <p className="mb-4 inline-flex items-center rounded-full border border-linen-border bg-white px-3 py-1 text-[13px] font-medium text-steel">
          {eyebrow}
        </p>
      )}
      <h1 className="text-4xl font-medium leading-[1.05] tracking-tight text-charcoal md:text-6xl">
        {title}
      </h1>
      {sub && (
        <p className="mx-auto mt-5 max-w-xl text-balance text-lg leading-snug text-charcoal/65">
          {sub}
        </p>
      )}
      {(primary || secondary) && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {primary && (
            <Link
              href={primary.href}
              className="rounded-buttons bg-charcoal px-5 py-2.5 text-[15px] font-medium text-parchment transition-colors hover:bg-charcoal/90"
            >
              {primary.label}
            </Link>
          )}
          {secondary && (
            <Link
              href={secondary.href}
              className="rounded-buttons border border-linen-border bg-white px-5 py-2.5 text-[15px] font-medium text-charcoal transition-colors hover:border-stone"
            >
              {secondary.label}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

export function Section({
  eyebrow,
  title,
  sub,
  children,
  narrow,
}: {
  eyebrow?: string;
  title?: ReactNode;
  sub?: string;
  children: ReactNode;
  narrow?: boolean;
}) {
  return (
    <section className={`mx-auto px-4 py-12 md:px-8 md:py-16 ${narrow ? "max-w-3xl" : "max-w-6xl"}`}>
      {(eyebrow || title || sub) && (
        <div className="mx-auto mb-10 max-w-2xl text-center">
          {eyebrow && (
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-steel">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-3xl font-medium tracking-tight text-charcoal md:text-4xl">{title}</h2>
          )}
          {sub && <p className="mt-4 text-lg leading-snug text-charcoal/65">{sub}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

export function FeatureGrid({ items }: { items: { title: string; desc: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f) => (
        <div key={f.title} className="rounded-2xl border border-black/10 bg-white p-5">
          <h3 className="font-medium text-charcoal">{f.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-steel">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}

export function Faq({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div className="mx-auto flex w-full flex-col gap-2">
      {items.map((f) => (
        <details
          key={f.q}
          className="group rounded-2xl border border-linen-border bg-parchment open:shadow-sm"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-left text-lg font-medium leading-normal text-charcoal [&::-webkit-details-marker]:hidden">
            {f.q}
            <ChevronDownIcon
              className="size-5 shrink-0 text-dim-gray transition-transform duration-200 group-open:-rotate-90 motion-reduce:transition-none"
            />
          </summary>
          <div className="px-4 pb-3 text-base text-balance leading-relaxed text-charcoal/60">
            {f.a}
          </div>
        </details>
      ))}
    </div>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M6.46967 9.46967C6.76256 9.17678 7.23744 9.17678 7.53033 9.46967L12 13.9393L16.4697 9.46967C16.7626 9.17678 17.2374 9.17678 17.5303 9.46967C17.8232 9.76256 17.8232 10.2374 17.5303 10.5303L12.5303 15.5303C12.2374 15.8232 11.7626 15.8232 11.4697 15.5303L6.46967 10.5303C6.17678 10.2374 6.17678 9.76256 6.46967 9.46967Z" />
    </svg>
  );
}

export function CtaBand({
  title = "Ready to bring your idea to life?",   sub = "Describe it in words — Freebuff designs, builds and ships it with you.",
}: {
  title?: string;
  sub?: string;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center md:py-24">
      <h2 className="text-3xl font-medium tracking-tight text-charcoal md:text-5xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-lg text-charcoal/65">{sub}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
        <Link
          href="/new"
          className="rounded-buttons bg-charcoal px-5 py-2.5 text-[15px] font-medium text-parchment transition-colors hover:bg-charcoal/90"
        >
          Start building
        </Link>
        <Link
          href="/enterprise"
          className="rounded-buttons border border-linen-border bg-white px-5 py-2.5 text-[15px] font-medium text-charcoal transition-colors hover:border-stone"
        >
          Talk to sales
        </Link>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-4 w-4 text-charcoal" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 6 5 9l4.25-6" />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-4 w-4 text-stone" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M2.5 6h7" />
    </svg>
  );
}

export function CompareTable({
  cols,
  rows,
}: {
  cols: [string, string];
  rows: { label: string; values: (boolean | string)[] }[];
}) {
  return (
    <div className="mx-auto max-w-4xl overflow-x-auto rounded-2xl border border-black/10 bg-white">
      <table className="w-full min-w-[560px] text-left text-[15px]">
        <thead>
          <tr className="border-b border-black/10">
            <th className="px-5 py-4 font-medium text-steel">Capability</th>
            {cols.map((c) => (
              <th key={c} className="px-5 py-4 font-medium text-charcoal">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-black/5 last:border-0">
              <td className="px-5 py-3.5 text-charcoal">{r.label}</td>
              {r.values.map((v, i) => (
                <td key={i} className="px-5 py-3.5">
                  {typeof v === "boolean" ? (
                    v ? (
                      <CheckIcon />
                    ) : (
                      <DashIcon />
                    )
                  ) : (
                    <span className="text-steel">{v}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <main className="bg-parchment">
      <section className="mx-auto max-w-3xl px-4 pb-20 pt-16 md:pt-24">
        <h1 className="text-4xl font-medium tracking-tight text-charcoal md:text-5xl">{title}</h1>
        {updated && <p className="mt-3 text-sm text-steel">Last updated: {updated}</p>}
        <div className="mt-10 space-y-8 [&_h2]:text-xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-charcoal [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-steel [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_ul]:text-steel [&_a]:text-charcoal [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </section>
    </main>
  );
}

export function PersonaPage({
  role,
  hero,
  sub,
  points,
  useCases,
  faqs,
  heroImg,
  gallery,
}: {
  role: string;
  hero: string;
  sub: string;
  points: { title: string; desc: string; img?: string }[];
  useCases: { title: string; desc: string; href: string; img?: string }[];
  faqs: { q: string; a: string }[];
  heroImg?: { src: string; alt: string };
  gallery?: { src: string; alt: string }[];
}) {
  const withImages = points.some((p) => p.img);
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow={`Tools for ${role}`}
        title={hero}
        sub={sub}
        primary={{ label: "Start building", href: "/new" }}
        secondary={{ label: "See templates", href: "/templates" }}
      />
      {heroImg && (
        <section className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="overflow-hidden rounded-3xl border border-black/10 shadow-sm">
            <img src={heroImg.src} alt={heroImg.alt} loading="eager" decoding="async" className="aspect-[16/8] w-full object-cover" />
          </div>
        </section>
      )}
      {gallery && gallery.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((g) => (
              <div key={g.src} className="overflow-hidden rounded-2xl border border-black/10">
                <img src={g.src} alt={g.alt} loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}
      <Section>
        {withImages ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {points.map((p) => (
              <div key={p.title} className="overflow-hidden rounded-2xl border border-black/10 bg-white">
                {p.img && (
                  <img src={p.img} alt={p.title} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover" />
                )}
                <div className="p-5">
                  <h3 className="font-medium text-charcoal">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-steel">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <FeatureGrid items={points} />
        )}
      </Section>
      <Section eyebrow="Use cases" title={`What ${role} ship with Freebuff`}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {useCases.map((u) => (
            <Link
              key={u.title}
              href={u.href}
              className="group overflow-hidden rounded-2xl border border-black/10 bg-white transition-colors hover:border-stone"
            >
              {u.img && (
                <img src={u.img} alt="" aria-hidden="true" loading="lazy" decoding="async" className="aspect-[16/8] w-full object-cover" />
              )}
              <div className="p-5">
                <h3 className="font-medium text-charcoal group-hover:underline">{u.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-steel">{u.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
      <Section narrow eyebrow="FAQ" title="Frequently asked questions">
        <Faq items={faqs} />
      </Section>
      <CtaBand />
    </main>
  );
}
