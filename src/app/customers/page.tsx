import Link from "next/link";
import { CtaBand, InnerHero, Section } from "@/components/site/inner";
import { px } from "@/lib/img";

const PX = px("/");
const LOGOS = [
  { name: "o3world", src: `${PX}/o3world/customers-o3world-logo-black.png` },
  { name: "exprealty", src: `${PX}/exprealty/customers-exprealty-logo.svg` },
  { name: "sciongroup", src: `${PX}/sciongroup/customers-sciongroup-logo.svg` },
  { name: "nursa", src: `${PX}/nursa/customers-nursa-logo.svg` },
  { name: "atonom", src: `${PX}/atonom/customers-atonom-logo.svg` },
  { name: "elevenlabs", src: `${PX}/elevenlabs/customers-elevenlabs-logo.svg` },
  { name: "productiv", src: `${PX}/productiv/customers-productiv-logo.svg` },
  { name: "deliveryhero", src: `${PX}/deliveryhero/customers-deliveryhero-logo.svg` },
  { name: "sentry", src: `${PX}/sentry/customers-sentry-logo.svg` },
  { name: "appdirect", src: `${PX}/appdirect/customers-appdirect-logo.svg` },
];

const STORIES = [
  { slug: "nursa", company: "Nursa", title: "A new product in 48 hours", desc: "How Nursa rebuilt its clinician marketplace experience over a single weekend." },
  { slug: "deliveryhero", company: "DeliveryHero", title: "Prototyping at enterprise speed", desc: "Internal teams validate ideas in days instead of quarters." },
  { slug: "exprealty", company: "Exprealty", title: "A CRM that fits better", desc: "Replacing a legacy contract with software the team loves." },
  { slug: "o3world", company: "o3 World", title: "Agency output, multiplied", desc: "Client launches in days with full-stack generation." },
  { slug: "sciongroup", company: "Scion Group", title: "Operations, digitized", desc: "Tracking, dispatch and reporting in a single internal app." },
  { slug: "atonom", company: "Atonom", title: "From idea to funded", desc: "A demo-day product built entirely from prompts." },
  { slug: "elevenlabs", company: "ElevenLabs", title: "Voice meets vibe-coding", desc: "Experiments and tools around world-class voice AI." },
  { slug: "productiv", company: "Productiv", title: "SaaS insights, faster", desc: "Internal analytics views without the backlog." },
  { slug: "sentry", company: "Sentry", title: "Developer tools, demoed live", desc: "Interactive sandboxes for complex products." },
];

export default function CustomersPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Customers"
        title="Customer stories"
        sub="Startups, enterprises and solo builders shipping real software with AI."
        primary={{ label: "Start building", href: "/new" }}
        secondary={{ label: "See templates", href: "/templates" }}
      />
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="overflow-hidden rounded-3xl border border-black/10 shadow-sm">
          <img
            src={px("/")}
            alt="Customer projects built with Freebuff"
            loading="eager"
            decoding="async"
            className="aspect-[16/8] w-full object-cover"
          />
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {LOGOS.map((l) => (
            <img key={l.name} src={l.src} alt={l.name} loading="lazy" className="h-6 w-auto opacity-70 transition-opacity hover:opacity-100" />
          ))}
        </div>
      </section>

      <Section eyebrow="All stories" title="Loved by teams everywhere">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STORIES.map((s, i) => (
            <Link
              key={s.slug}
              href="/blog"
              className="group overflow-hidden rounded-2xl border border-black/10 bg-white transition-colors hover:border-stone"
            >
              <div className="flex h-36 items-center justify-center border-b border-black/5 bg-white p-6">
                <img
                  src={LOGOS[i % LOGOS.length].src}
                  alt={s.company}
                  loading="lazy"
                  className="max-h-12 w-auto max-w-[70%] object-contain"
                />
              </div>
              <div className="p-5">
                <p className="text-[13px] font-medium uppercase tracking-wide text-steel">{s.company}</p>
                <h3 className="mt-1 font-medium text-charcoal group-hover:underline">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-steel">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
      <CtaBand />
    </main>
  );
}
