import { CtaBand, Faq, FeatureGrid, InnerHero, Section } from "@/components/site/inner";
import { px } from "@/lib/img";

const CD = px("https://lovable.dev/cdn-cgi/image/width=1284,f=auto,fit=scale-down");

const ROWS = [
  {
    img: `${CD}/https://assets.lovable.dev/img/marketing-content/audiences/marketers/landing-page.webp`,
    title: "Launch branded landing pages",
    desc: "Save $50,000 by using Lovable for landing pages. Build and iterate using your existing design systems to keep everything pixel perfect. No agency fees, CMS constraints, or engineering handoffs.",
  },
  {
    img: `${CD}/https://assets.lovable.dev/img/marketing-content/audiences/marketers/event.jpg`,
    title: "Build interactive campaign experiences",
    desc: "Go beyond templates to create digital experiences that respond to user input and update dynamically using live data from tools like HubSpot, Notion, and Linear.",
  },
  {
    img: `${CD}/https://assets.lovable.dev/img/marketing-content/audiences/marketers/teams.webp`,
    title: "Give teams one source of truth",
    desc: "Centralize event schedules, launch messaging, enablement assets, and FAQs in a single portal that stays current without manual coordination across docs and threads.",
  },
  {
    img: `${CD}/https://assets.lovable.dev/img/marketing-content/audiences/marketers/performance.webp`,
    title: "Make performance visible without spreadsheets",
    desc: "Create dashboards for pipeline, campaign performance, and lead flow so stakeholders can self-serve updates without pulling data manually into slides or reworking spreadsheets.",
  },
];

export default function MarketersPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Tools for marketers"
        title="Ship faster"
        sub="Launch on-brand landing pages, interactive campaigns, and digital experiences without engineering bottlenecks."
        primary={{ label: "Start building", href: "/new" }}
        secondary={{ label: "See templates", href: "/templates" }}
      />
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="overflow-hidden rounded-3xl border border-black/10">
          <img
            src={px("https://lovable.dev/cdn-cgi/image/width=2000,f=auto,fit=scale-down/https://assets.lovable.dev/img/marketing-content/audiences/marketers/hero/gradient-bg.webp")}
            alt=""
            aria-hidden="true"
            className="aspect-[16/7] w-full object-cover"
          />
        </div>
      </section>

      <Section eyebrow="What marketing teams ship" title="What marketing teams ship with Lovable">
        <div className="flex flex-col gap-14 md:gap-20">
          {ROWS.map((r, i) => (
            <div
              key={r.title}
              className={`grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-12 ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
                <img src={r.img} alt={r.title} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-medium tracking-tight text-charcoal md:text-3xl">{r.title}</h3>
                <p className="mt-3 text-lg leading-snug text-charcoal/65">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Why marketers choose Lovable"
        title="Bring campaign ideas to life without bottlenecks."
        sub="Build, test, and publish digital experiences, without waiting on engineering or cobbling together previous assets, all by just chatting to Lovable."
      >
        <FeatureGrid
          items={[
            { title: "Speed", desc: "Launch and update pages without engineering bottlenecks." },
            { title: "On-brand", desc: "Reuse design systems and components so every page stays on brand." },
            { title: "SEO built-in", desc: "SEO-optimized pages designed to drive organic traffic." },
            { title: "Governance", desc: "Control who can edit and publish so changes don't create risk." },
          ]}
        />
      </Section>

      <Section narrow eyebrow="FAQ" title="Frequently asked questions">
        <Faq
          items={[
            { q: "Can I keep everything on brand?", a: "Yes, you can keep everything on brand by using shared components, styles, and reusable sections across pages, in addition to our design systems feature. Teams can standardize core layouts while still making campaign-specific edits." },
            { q: "Do I need engineering?", a: "No, you do not need engineering. Marketing teams can draft, iterate, and publish digital experiences independently, and involve engineering only for deeper integrations or advanced workflows." },
            { q: "What integrations work with Lovable?", a: "Lovable works with common marketing integrations for analytics, tracking, and lead capture. Teams connect it to their CRM and analytics stack depending on how they measure performance and route form submissions." },
            { q: "Does Lovable support SEO?", a: "Lovable supports SEO fundamentals such as editable metadata and indexable pages. Teams can ship updates quickly while keeping pages structured for search and sharing." },
            { q: "Can Lovable replace our CMS for landing pages?", a: "Yes, Lovable can replace a CMS for many landing-page workflows, especially for campaigns that require frequent iteration. Some teams still keep a CMS for blogs or long-form publishing." },
            { q: "How does publishing work?", a: "Publishing works through a draft-to-live workflow so teams can review changes before they go live. You can also restrict who has permission to publish." },
            { q: "Is Lovable secure for enterprise teams?", a: "Yes, Lovable supports enterprise-grade controls such as role-based access and governed publishing workflows. Teams can limit who can edit, review, and publish." },
          ]}
        />
      </Section>
      <CtaBand />
    </main>
  );
}
