import { CtaBand, FeatureGrid, InnerHero, Section } from "@/components/site/inner";
import { px } from "@/lib/img";

const PHOTOS = Array.from({ length: 8 }, (_, i) => ({
  src: `${px("https://lovable.dev/cdn-cgi/image/width=640,f=auto,fit=scale-down")}/https://storage.googleapis.com/lovable-assets/careers/hero/careers-hero-${i + 1}.jpg`,
  alt: `Life at Lovable ${i + 1}`,
}));

const BENEFITS = [
  { title: "Build in the open", desc: "Your work ships to millions of builders. Impact is the default." },
  { title: "Top of market pay", desc: "Competitive salary plus equity in a rocketship." },
  { title: "Work from anywhere", desc: "Stockholm, San Francisco, London, Boston — or remotely across the globe." },
  { title: "Health & wellness", desc: "Comprehensive coverage for you and your family." },
  { title: "Learn fast", desc: "Budget for books, courses and conferences. Growth is the job." },
  { title: "Community groups", desc: "Find your people across interests, identities and crafts." },
];

const ROLES = [
  { title: "Product Engineer", dept: "Product", loc: "Stockholm / Remote" },
  { title: "AI Research Engineer, Post-training", dept: "Research", loc: "Stockholm" },
  { title: "Product Designer", dept: "Design", loc: "Stockholm / Remote" },
  { title: "Solutions Architect", dept: "Go-to-market", loc: "San Francisco" },
  { title: "Customer Experience Lead", dept: "Support", loc: "Remote" },
  { title: "Security Engineer", dept: "Security", loc: "Stockholm" },
  { title: "Growth Marketer", dept: "Marketing", loc: "London / Remote" },
  { title: "Data Scientist, Product", dept: "Data", loc: "Boston / Remote" },
];

export default function CareersPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Careers"
        title="Unlock Creativity"
        sub="We're hiring across engineering, design, research and go-to-market — in Stockholm, San Francisco, London, Boston and remote."
        primary={{ label: "See open roles", href: "#roles" }}
      />
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {PHOTOS.map((p) => (
            <div key={p.src} className="overflow-hidden rounded-2xl border border-black/10">
              <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105" />
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-lg text-steel">
          You&apos;ll find us around the world. In Stockholm, San Francisco, London, Boston.
        </p>
      </section>

      <Section eyebrow="Why Lovable" title="You'll love it here if…">
        <FeatureGrid items={BENEFITS} />
      </Section>

      <section id="roles" className="mx-auto max-w-4xl scroll-mt-24 px-4 pb-4 md:px-8">
        <h2 className="text-center text-3xl font-medium tracking-tight text-charcoal md:text-4xl">
          Open roles. Join the team.
        </h2>
        <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-white">
          {ROLES.map((r, i) => (
            <div
              key={r.title}
              className={`flex flex-wrap items-center justify-between gap-2 px-5 py-4 ${i > 0 ? "border-t border-black/5" : ""}`}
            >
              <div>
                <p className="font-medium text-charcoal">{r.title}</p>
                <p className="text-sm text-steel">
                  {r.dept} · {r.loc}
                </p>
              </div>
              <span className="rounded-buttons border border-linen-border px-4 py-1.5 text-sm font-medium text-charcoal">
                Apply
              </span>
            </div>
          ))}
        </div>
      </section>
      <CtaBand />
    </main>
  );
}
