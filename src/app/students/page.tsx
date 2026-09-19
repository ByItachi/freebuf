import { CtaBand, Faq, FeatureGrid, InnerHero, Section } from "@/components/site/inner";
import { px } from "@/lib/img";

const UNIS = ["oxford", "stanford", "cambridge", "ethz", "harvard", "kth", "princeton", "nus", "yale", "tum", "texas"];

export default function StudentsPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Education"
        title="Students get Lovable for half the price"
        sub="Build portfolios, hackathon entries and startups while you study."
        primary={{ label: "Claim student discount", href: "/new" }}
      />
      <section className="mx-auto max-w-5xl px-4 md:px-8">
        <p className="text-center text-sm font-medium uppercase tracking-wide text-steel">
          Lovable is used by students worldwide
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {UNIS.map((u) => (
            <img
              key={u}
              src={px(`https://lovable.dev/cdn-cgi/image/width=200,f=auto,fit=scale-down/https://assets.lovable.dev/img/marketing-content/landing/students/logos/${u}.svg`)}
              alt={u}
              loading="lazy"
              className="h-6 w-auto opacity-60 transition-opacity hover:opacity-100"
            />
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
