import { CtaBand, Faq, FeatureGrid, InnerHero, Section } from "@/components/site/inner";

const UNIS: { name: string; short: string }[] = [
  { name: "Oxford", short: "OX" },
  { name: "Stanford", short: "ST" },
  { name: "Cambridge", short: "CA" },
  { name: "ETH Zürich", short: "ET" },
  { name: "Harvard", short: "HA" },
  { name: "KTH", short: "KT" },
  { name: "Princeton", short: "PR" },
  { name: "NUS", short: "NU" },
  { name: "Yale", short: "YA" },
  { name: "TU München", short: "TU" },
  { name: "UT Austin", short: "UT" },
];

export default function StudentsPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Education"
        title="Students get Freebuff for half the price"
        sub="Build portfolios, hackathon entries and startups while you study."
        primary={{ label: "Claim student discount", href: "/new" }}
      />
      <section className="mx-auto max-w-5xl px-4 md:px-8">
        <p className="text-center text-sm font-medium uppercase tracking-wide text-steel">
          Freebuff is used by students worldwide
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {UNIS.map((u) => (
            <span
              key={u.short}
              title={u.name}
              className="inline-flex items-center gap-2 rounded-full border border-linen-border bg-warm-sand px-4 py-1.5 text-sm text-steel transition-colors hover:text-charcoal"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-charcoal/10 font-mono-code text-[10px] font-semibold text-charcoal/80">
                {u.short}
              </span>
              {u.name}
            </span>
          ))}
        </div>
      </section>

      <Section eyebrow="Benefits" title="Get started with benefits">
        <FeatureGrid
          items={[
            { title: "50% off paid plans", desc: "Verify your student status once, save every month." },
            { title: "Portfolio that moves", desc: "Graduate with live products, not screenshots." },
            { title: "Hackathon ready", desc: "From idea to demo before the deadline." },
            { title: "Learn by shipping", desc: "Every concept sticks better in a real app." },
          ]}
        />
      </Section>
      <Section narrow eyebrow="FAQ" title="FAQ Student Discount">
        <Faq
          items={[
            { q: "Who qualifies?", a: "Anyone enrolled at an accredited school, college or university with a verifiable student email." },
            { q: "How do I verify?", a: "Sign up with your student email or upload proof of enrollment — approval usually lands within a day." },
            { q: "Does it work with free plans?", a: "The free plan stays free. The discount applies to paid tiers when you need more builds, collaborators or projects." },
          ]}
        />
      </Section>
      <CtaBand title="Ready to get started?" sub="Verify once, build all semester." />
    </main>
  );
}
