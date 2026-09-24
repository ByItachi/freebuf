import Link from "next/link";
import { CtaBand, Faq } from "@/components/site/inner";
import { TrustedBy } from "@/components/site/trusted-by";
import { px } from "@/lib/img";

const rowSrc = (file: string) => px(file);

const ROWS = [
  {
    file: px("/refero/card-09.jpg"),
    title: "Launch branded landing pages",
    desc: "Save $50,000 by using Freebuff for landing pages. Build and iterate using your existing design systems to keep everything pixel perfect. No agency fees, CMS constraints, or engineering handoffs.",
  },
  {
    file: px("/refero/card-10.jpg"),
    title: "Build interactive campaign experiences",
    desc: "Go beyond templates to create digital experiences that respond to user input and update dynamically using live data from tools like HubSpot, Notion, and Linear.",
  },
  {
    file: px("/refero/card-11.jpg"),
    title: "Give teams one source of truth",
    desc: "Centralize event schedules, launch messaging, enablement assets, and FAQs in a single portal that stays current without manual coordination across docs and threads.",
  },
  {
    file: px("/refero/card-12.jpg"),
    title: "Make performance visible without spreadsheets",
    desc: "Create dashboards for pipeline, campaign performance, and lead flow so stakeholders can self-serve updates without pulling data manually into slides or reworking spreadsheets.",
  },
];

const FEATURES = [
  { title: "Speed", desc: "Launch and update pages without engineering bottlenecks." },
  { title: "On-brand", desc: "Reuse design systems and components so every page stays on brand." },
  { title: "SEO built-in", desc: "SEO-optimized pages designed to drive organic traffic." },
  {
    title: "Governance",
    desc: "Control who can edit and publish so changes don't create risk.",
  },
];

export default function MarketersPage() {
  return (
    <main className="bg-parchment">
      {/* Full-bleed hero with aurora backdrop, dark "Ship" chip + cursor */}
      <section className="relative mb-10 flex min-h-[720px] flex-col items-center justify-center overflow-hidden bg-warm-sand">
        <div aria-hidden="true" className="hero-gradient pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative flex w-full flex-col items-center gap-6 px-4">
          <h1 className="text-center text-xl font-medium leading-tight tracking-tight text-charcoal">
            Tools for marketers
          </h1>
          <h2 className="text-center text-6xl font-bold leading-[0.95] tracking-tighter text-charcoal md:text-8xl">
            <span className="relative inline-block rounded-2xl bg-charcoal px-6 py-4 text-parchment">
              Ship
              <span aria-hidden="true" className="absolute -bottom-2 -right-6 size-10">
                <svg width="100%" height="100%" viewBox="0 0 41 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1.84743 3.15187L7.07024 47.1452L16.2476 36.5343L22.5634 47.4736C23.7922 49.6019 26.5823 49.6802 28.2482 48.7184C30.1485 47.6213 31.4314 45.1915 30.2026 43.0632L23.8868 32.1239L36.9445 28.6727L1.84743 3.15187Z"
                    fill="black"
                    stroke="white"
                    strokeWidth="2.92568"
                  />
                </svg>
              </span>
            </span>{" "}
            <span className="inline-block">faster</span>
          </h2>
          <div className="flex flex-col items-center justify-center gap-8">
            <p className="mx-auto max-w-lg text-balance text-center font-medium leading-tight tracking-tight text-charcoal sm:text-xl">
              Launch on-brand landing pages, interactive campaigns, and digital experiences without
              engineering bottlenecks.
            </p>
            <Link
              href="/enterprise"
              className="hero-gradient-btn rounded-full px-5 py-2.5 text-[15px] font-medium text-ink transition-[filter] hover:brightness-110"
            >
              Book a demo
            </Link>
          </div>
        </div>
      </section>

      <TrustedBy />

      {/* What marketing teams ship — alternating image/text cards */}
      <section className="w-full py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <h2 className="mb-10 max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight text-charcoal md:text-6xl">
            What marketing teams ship with Freebuff
          </h2>
          <div className="flex flex-col space-y-10 md:space-y-16 md:[&>*:nth-child(even)]:flex-row-reverse">
            {ROWS.map((r) => (
              <div
                key={r.title}
                className="flex flex-col-reverse gap-5 rounded-3xl border border-linen-border bg-warm-sand p-4 md:flex-row"
              >
                <div className="flex flex-1 flex-col pt-6 md:pr-16 lg:pt-10">
                  <h3 className="mb-2 text-xl font-medium leading-[1.1] tracking-tight text-charcoal md:text-2xl">
                    {r.title}
                  </h3>
                  <p className="text-balance leading-relaxed text-charcoal/60">{r.desc}</p>
                </div>
                <div className="relative flex-1 overflow-hidden rounded-xl border border-linen-border bg-parchment">
                  <img
                    width={642}
                    height={448}
                    alt={r.title}
                    loading="lazy"
                    decoding="async"
                    src={r.file}
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign visual + feature list */}
      <section className="w-full">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="mb-10 space-y-5">
            <h2 className="max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight text-charcoal md:text-6xl">
              Bring campaign ideas to life without bottlenecks.
            </h2>
            <p className="max-w-xl text-balance leading-relaxed text-charcoal/60">
              Build, test, and publish digital experiences, without waiting on engineering or
              cobbling together previous assets, all by just chatting to Freebuff.
            </p>
          </div>
          <div className="flex flex-col gap-10 rounded-3xl border border-linen-border bg-warm-sand p-6 lg:flex-row">
            <div className="relative w-full basis-1/2 overflow-hidden rounded-xl">
              <img
                src={px("/templates/t1.jpg")}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex basis-1/2 flex-col gap-6 lg:gap-10">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className={`flex flex-col items-start lg:flex-row lg:gap-6 ${
                    i > 0 ? "border-t border-linen-border pt-5" : ""
                  }`}
                >
                  <div className="flex-1 md:pr-3">
                    <h3 className="mb-2 text-xl font-medium leading-[1.1] tracking-tight text-charcoal md:text-2xl">
                      {f.title}
                    </h3>
                  </div>
                  <div className="flex-1 md:pr-3">
                    <p className="text-balance leading-relaxed text-charcoal/60">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="flex flex-col items-center gap-10 py-16 md:py-24">
            <div className="flex w-full max-w-xl flex-col gap-2">
              <h2 className="mb-8 w-full text-center text-4xl font-semibold leading-[1.1] tracking-tight text-charcoal md:text-5xl">
                Frequently asked questions
              </h2>
              <Faq
                items={[
                  {
                    q: "Can I keep everything on brand?",
                    a: "Yes, you can keep everything on brand by using shared components, styles, and reusable sections across pages, in addition to our design systems feature. Teams can standardize core layouts while still making campaign-specific edits.",
                  },
                  {
                    q: "Do I need engineering?",
                    a: "No, you do not need engineering. Marketing teams can draft, iterate, and publish digital experiences independently, and involve engineering only for deeper integrations or advanced workflows.",
                  },
                  {
                    q: "What integrations work with Freebuff?",
                    a: (
                      <>
                        Freebuff works with common marketing integrations for analytics, tracking,
                        and lead capture. Teams connect it to their CRM and analytics stack
                        depending on how they measure performance and route form submissions. Learn
                        more about our connectors{" "}
                        <Link href="/connect" className="underline">
                          here
                        </Link>
                        .
                      </>
                    ),
                  },
                  {
                    q: "Does Freebuff support SEO?",
                    a: "Freebuff supports SEO fundamentals such as editable metadata and indexable pages. Teams can ship updates quickly while keeping pages structured for search and sharing.",
                  },
                  {
                    q: "Can Freebuff replace our CMS for landing pages?",
                    a: "Yes, Freebuff can replace a CMS for many landing-page workflows, especially for campaigns that require frequent iteration. Some teams still keep a CMS for blogs or long-form publishing.",
                  },
                  {
                    q: "How does publishing work?",
                    a: "Publishing works through a draft-to-live workflow so teams can review changes before they go live. You can also restrict who has permission to publish.",
                  },
                  {
                    q: "Is Freebuff secure for enterprise teams?",
                    a: "Yes, Freebuff supports enterprise-grade controls such as role-based access and governed publishing workflows. Teams can limit who can edit, review, and publish.",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
