import { CtaBand, FeatureGrid, InnerHero, Section } from "@/components/site/inner";
import { px } from "@/lib/img";

const CD = px("/");
const BASE = "/";

export default function CloudPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Platform"
        title="Introducing Freebuff Cloud & AI"
        sub="Hosting, data and models in one place — so prompts become production."
        primary={{ label: "Start building", href: "/new" }}
        secondary={{ label: "Talk to sales", href: "/enterprise" }}
      />
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="overflow-hidden rounded-3xl border border-black/10 shadow-sm">
          <img
            src={`${CD}/${BASE}/cloud-hero-light.png`}
            alt="Freebuff Cloud dashboard"
            loading="eager"
            decoding="async"
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      </section>

      <Section eyebrow="Freebuff Cloud" title="Backend without the ops">
        <FeatureGrid
          items={[
            { title: "Postgres database", desc: "Managed data with auth and row-level security." },
            { title: "File storage", desc: "Uploads, images and assets served globally." },
            { title: "Edge functions", desc: "Server logic that scales to zero and back." },
            { title: "One-click deploys", desc: "Preview URLs for every version, custom domains for launch." },
          ]}
        />
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            { img: `${CD}/${BASE}/hit-the-ground-running.jpg`, title: "Hit the ground running" },
            { img: `${CD}/${BASE}/stop-wasting-time.jpg`, title: "Stop wasting time" },
            { img: `${CD}/${BASE}/what-can-you-build.jpg`, title: "What can you build?" },
          ].map((f) => (
            <div key={f.title} className="overflow-hidden rounded-2xl border border-black/10 bg-white">
              <img src={f.img} alt={f.title} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
              <p className="p-4 font-medium text-charcoal">{f.title}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Freebuff AI" title="Models, tuned for building">
        <FeatureGrid
          items={[
            { title: "Every flagship model", desc: "Pick the best brain for each task, switch any time." },
            { title: "Build-aware context", desc: "The agent sees your files, diffs and errors." },
            { title: "Private by default", desc: "Business data never trains models." },
          ]}
        />
      </Section>
      <CtaBand />
    </main>
  );
}
