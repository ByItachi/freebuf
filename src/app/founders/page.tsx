import Link from "next/link";
import { CtaBand, Faq, InnerHero, Section } from "@/components/site/inner";
import { px } from "@/lib/img";

const STEPS = [
  { title: "Describe your idea", desc: "Two or three sentences is enough to get a working first version.", img: px("/refero/card-02.jpg") },
  { title: "Full stack, included", desc: "Frontend, backend, auth and database — generated together.", img: px("/refero/card-03.jpg") },
  { title: "Infra you don't touch", desc: "Hosting, SSL and scaling handled automatically.", img: px("/refero/card-04.jpg") },
  { title: "Polish the design", desc: "Click anything to refine it until it feels like yours.", img: px("/refero/card-05.jpg") },
  { title: "Publish & grow", desc: "Ship to a live URL, then iterate on real feedback daily.", img: px("/refero/card-06.jpg") },
];

const USE_CASES = [
  { title: "B2B SaaS", href: "/solutions/use-case/saas-landing-page" },
  { title: "Consumer apps", href: "/solutions/use-case/front-end-app-social-media-apps" },
  { title: "Marketplaces & e-commerce", href: "/solutions/use-case/e-commerce-storefronts" },
  { title: "Landing pages & websites", href: "/solutions/use-case/startup-landing-page" },
  { title: "Internal tools & dashboards", href: "/solutions/use-case/dashboard-data-visualization-dashboards" },
];

export default function FoundersPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Tools for founders"
        title="Build your dream"
        sub="Your AI cofounder and dev team. Dream it. Build it. Ship it."
        primary={{ label: "Start building", href: "/new" }}
      />
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="overflow-hidden rounded-3xl border border-linen-border shadow-sm">
          <img
            src={px("/refero/card-01.jpg")}
            alt="App built with Freebuff"
            loading="eager"
            decoding="async"
            className="aspect-[16/8] w-full object-cover"
          />
        </div>
      </section>

      <Section eyebrow="How it works" title="From idea to launched in five steps">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.title} className="overflow-hidden rounded-2xl border border-linen-border bg-warm-sand">
              <img src={s.img} alt={s.title} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover" />
              <div className="p-5">
                <h3 className="font-medium text-charcoal">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-steel">{s.desc}</p>
              </div>
            </div>
          ))}
          <Link
            href="/new"
            className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl bg-charcoal p-5 text-center transition-colors hover:bg-charcoal/90"
          >
            <span className="text-xl font-medium text-parchment">Your turn.</span>
            <span className="mt-2 text-sm text-parchment/70">Describe your dream →</span>
          </Link>
        </div>
      </Section>

      <Section eyebrow="What founders ship" title="Dream it. Build it. Ship it.">
        <div className="flex flex-wrap gap-2">
          {USE_CASES.map((u) => (
            <Link
              key={u.title}
              href={u.href}
              className="rounded-full border border-linen-border bg-warm-sand px-4 py-1.5 text-sm text-steel transition-colors hover:border-steel hover:text-charcoal"
            >
              {u.title}
            </Link>
          ))}
        </div>
      </Section>

      <Section narrow eyebrow="FAQ" title="Frequently asked questions">
        <Faq
          items={[
            { q: "Do I need to know how to code?", a: "No. Founders ship full products with plain-language prompts every day — and can hire developers later on clean, exported code." },
            { q: "Can it handle payments and users?", a: "Yes — Stripe billing, auth, databases and admin views are all standard building blocks." },
            { q: "What does it cost to start?", a: "Start free. Paid plans scale with usage as you grow from prototype to production." },
          ]}
        />
      </Section>
      <CtaBand />
    </main>
  );
}
