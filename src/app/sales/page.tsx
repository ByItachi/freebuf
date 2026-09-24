import { CtaBand, Faq, InnerHero, Section } from "@/components/site/inner";
import { px } from "@/lib/img";

const CD = px("/");
const CDH = px("/");
const BASE = "/";

const ROWS = [
  { img: `${CD}/${BASE}/account-demos.webp`, title: "Account demos that feel real", desc: "Tailor a live demo environment to every big deal." },
  { img: `${CD}/${BASE}/revenue-dashboard.webp`, title: "Revenue dashboards", desc: "Pipeline, forecasts and targets in one live view." },
  { img: `${CD}/${BASE}/onboarding.webp`, title: "Onboarding that sticks", desc: "Guide new customers to value in days, not months." },
  { img: `${CD}/${BASE}/follow-ups.webp`, title: "Follow-ups on autopilot", desc: "Mutual action plans and nudges that keep deals moving." },
  { img: `${CD}/${BASE}/deal-desk.webp`, title: "Your digital deal desk", desc: "Approvals, pricing and paperwork in one shared space." },
];

export default function SalesPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="For sales teams"
        title="Close deals faster"
        sub="Accelerate the sales cycle and drive revenue with custom demos, ROI calculators and deal rooms."
        primary={{ label: "Start building", href: "/new" }}
        secondary={{ label: "Talk to sales", href: "/enterprise" }}
      />
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="overflow-hidden rounded-3xl border border-black/10 shadow-sm">
          <img
            src={`${CDH}/${BASE}/tools.webp`}
            alt="Sales tools built with Freebuff"
            loading="eager"
            decoding="async"
            className="aspect-[16/8] w-full object-cover"
          />
        </div>
      </section>

      <Section eyebrow="In the field" title="How Freebuff unblocks sales teams">
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

      <Section narrow eyebrow="FAQ" title="Frequently asked questions">
        <Faq
          items={[
            { q: "Do I need technical skills?", a: "No. Describe the demo you want and iterate on it like a document." },
            { q: "Can I use our real data?", a: "Yes — connect CRMs and sheets, or use realistic sample data for first calls." },
            { q: "Is it approved by IT?", a: "Workspaces support SSO and roles, and nothing trains on your data on business plans." },
          ]}
        />
      </Section>
      <CtaBand />
    </main>
  );
}
