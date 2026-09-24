import { CtaBand, Faq, InnerHero, Section } from "@/components/site/inner";
import { px } from "@/lib/img";

const CD = px("/");
const AV = px("/");
const BASE = "/";

export default function ProductManagersPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Tools for product managers"
        title="Build internal tools and prototypes"
        sub="Create custom internal tools. Prototype ideas before they hit your roadmap."
        primary={{ label: "Start building", href: "/new" }}
        secondary={{ label: "See templates", href: "/templates" }}
      />

      <Section>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
            <img src={`${CD}/${BASE}/tools.webp`} alt="Internal tools built with Freebuff" loading="eager" decoding="async" className="aspect-[4/3] w-full object-cover" />
            <div className="p-5">
              <h2 className="text-xl font-medium tracking-tight text-charcoal">Create custom internal tools</h2>
              <p className="mt-1.5 text-[15px] leading-relaxed text-steel">Dashboards, approvals and ops views your team actually opens every day.</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
            <img src={`${CD}/${BASE}/idea-prototype.webp`} alt="Prototype turning into product" loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
            <div className="p-5">
              <h2 className="text-xl font-medium tracking-tight text-charcoal">Prototype ideas before they hit your roadmap</h2>
              <p className="mt-1.5 text-[15px] leading-relaxed text-steel">Validate with working software and real users — then spec with confidence.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="Loved by PMs" title="Teams prototype in the morning, test by lunch">
        <div className="flex items-center justify-center gap-4">
          {["chris-powell.jpg", "niklas-hatje.jpg", "evangelos-foutakoglou.jpg"].map((f) => (
            <img
              key={f}
              src={`${AV}/${BASE}/${f}`}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="h-20 w-20 rounded-full border border-black/10 object-cover md:h-24 md:w-24"
            />
          ))}
        </div>
      </Section>

      <Section narrow eyebrow="FAQ" title="Frequently asked questions">
        <Faq
          items={[
            { q: "Will engineering accept the output?", a: "Yes — prototypes export to GitHub as clean code, and specs arrive as working demos." },
            { q: "Can I connect real data?", a: "Yes. Supabase, APIs and CSVs plug straight into your builds." },
            { q: "Is it safe for company data?", a: "Workspaces include SSO, roles and audit logs; data isn't used for training on business plans." },
          ]}
        />
      </Section>
      <CtaBand />
    </main>
  );
}
