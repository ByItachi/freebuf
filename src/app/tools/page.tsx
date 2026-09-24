import { CtaBand, Faq, InnerHero, Section } from "@/components/site/inner";

const CD = "/";
const BASE = "/";

const ROWS = [
  { img: `${CD}/${BASE}/product.webp`, title: "Internal tools, built for anyone", desc: "If you can describe the workflow, you can ship the tool." },
  { img: `${CD}/${BASE}/finance-operations.jpg`, title: "Finance & operations", desc: "Approvals, budgets and reporting without the spreadsheet maze." },
  { img: `${CD}/${BASE}/people.webp`, title: "People tools", desc: "Directories, onboarding and requests your team loves." },
];

export default function ToolsPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Product"
        title="Build custom tools from your workflows, data, and ideas"
        sub="Use real context. Build without help. A perfect fit for every team."
        primary={{ label: "Start building", href: "/new" }}
        secondary={{ label: "Talk to sales", href: "/enterprise" }}
      />
      <Section>
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
                <h2 className="text-2xl font-medium tracking-tight text-charcoal md:text-3xl">{r.title}</h2>
                <p className="mt-3 text-lg leading-snug text-charcoal/65">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section narrow eyebrow="FAQ" title="Frequently asked questions">
        <Faq
          items={[
            { q: "What counts as an internal tool?", a: "Dashboards, approvals, trackers, directories — anything your team runs on." },
            { q: "Can it use our real data?", a: "Yes — connect databases, sheets and APIs with no integration code." },
            { q: "Who can build them?", a: "Anyone. Sales, marketing, product and ops teams ship tools daily." },
          ]}
        />
      </Section>
      <CtaBand />
    </main>
  );
}
