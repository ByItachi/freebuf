import { CtaBand, InnerHero, Section } from "@/components/site/inner";

const STATS = [
  { value: "4.8/5", label: "Average rating across review sites" },
  { value: "2M+", label: "Projects shipped by the community" },
  { value: "190+", label: "Countries with active builders" },
  { value: "48h", label: "Median idea-to-launch for MVPs" },
];

const REVIEWS = [
  { quote: "I replaced a six-week agency quote with a weekend of prompting. The site paid for itself immediately.", name: "Maya R.", role: "Founder, DTC brand" },
  { quote: "Our internal tools backlog finally moves. PMs prototype on Monday, ops uses it on Friday.", name: "Daniel K.", role: "Operations Lead" },
  { quote: "As a designer, I now hand over working products instead of mockups. Clients are stunned.", name: "Sofia L.", role: "Freelance designer" },
  { quote: "We validated three product ideas in two weeks without pulling engineers off the roadmap.", name: "James T.", role: "Product Manager" },
  { quote: "The visual edits feature is magic — click anything, describe the change, done.", name: "Priya N.", role: "Marketer" },
  { quote: "Security review passed faster than expected. SSO, audit logs and scanning covered our checklist.", name: "Alex B.", role: "IT Administrator" },
];

export default function ReviewsPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Reviews"
        title="Freebuff reviews: What customers are saying"
        sub="Real users, real products, real results."
        primary={{ label: "Try it yourself", href: "/new" }}
      />
      <Section eyebrow="Freebuff in numbers" title="Loved worldwide">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-black/10 bg-white p-5 text-center">
              <p className="text-3xl font-medium tracking-tight text-charcoal">{s.value}</p>
              <p className="mt-1.5 text-sm text-steel">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section eyebrow="Wall of love" title="Real users, real products, real results">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="flex flex-col rounded-2xl border border-black/10 bg-white p-5">
              <blockquote className="flex-1 text-[15px] leading-relaxed text-charcoal">
                “{r.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-medium text-charcoal">{r.name}</span>
                <span className="text-steel"> · {r.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>
      <CtaBand />
    </main>
  );
}
