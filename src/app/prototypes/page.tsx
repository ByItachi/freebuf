import { CtaBand, Faq, InnerHero, Section } from "@/components/site/inner";

const CD = "https://lovable.dev/cdn-cgi/image/width=1284,f=auto,fit=scale-down";
const BASE = "https://assets.lovable.dev/img/marketing-content/product/prototypes";

export default function PrototypesPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Product"
        title="Proof of concept in hours, not weeks"
        sub="Make your PRD real — clickable, data-driven prototypes before engineering starts."
        primary={{ label: "Start building", href: "/new" }}
        secondary={{ label: "See templates", href: "/templates" }}
      />
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
          <img
            src={`${CD}/${BASE}/prd.jpg`}
            alt="PRD turned into prototype"
            loading="eager"
            decoding="async"
            className="aspect-[16/8] w-full object-cover"
          />
        </div>
      </section>
      <Section eyebrow="Why prototype here" title="Make your PRD real">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { title: "Hours, not sprints", desc: "A working prototype before lunch." },
            { title: "Real data", desc: "Clickable flows backed by a real database." },
            { title: "Handoff included", desc: "Engineering inherits clean, exported code." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-black/10 bg-white p-5">
              <h3 className="font-medium text-charcoal">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-steel">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section narrow eyebrow="FAQ" title="Frequently asked questions">
        <Faq
          items={[
            { q: "Is a prototype enough to validate?", a: "Yes — real users clicking real flows beats slideware every time." },
            { q: "Can engineering continue from it?", a: "Yes. Everything syncs to GitHub as clean code." },
            { q: "How is this different from Figma?", a: "Figma shows pictures. These prototypes run — with data, auth and logic." },
          ]}
        />
      </Section>
      <CtaBand />
    </main>
  );
}
