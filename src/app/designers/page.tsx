import { CtaBand, Faq, Section } from "@/components/site/inner";
import { px } from "@/lib/img";
import { AdidasLogo, AsanaLogo, ElevenLabsLogo, ZendeskLogo, WorkdayLogo, NvidiaLogo } from "@/components/brand-logos";

const TRUSTED_LOGOS = [
  { name: "Adidas", Logo: AdidasLogo, h: "h-6" },
  { name: "Asana", Logo: AsanaLogo, h: "h-7" },
  { name: "ElevenLabs", Logo: ElevenLabsLogo, h: "h-7" },
  { name: "Zendesk", Logo: ZendeskLogo, h: "h-7" },
  { name: "Workday", Logo: WorkdayLogo, h: "h-7" },
  { name: "Nvidia", Logo: NvidiaLogo, h: "h-7" },
];

const FEATURES = [
  {
    title: "Prototype behavior, not just layout",
    desc: "Static screens can't simulate missing data, user errors, or changing permissions. Test interaction decisions with real logic and state.",
    img: px("/refero/card-01.jpg"),
  },
  {
    title: "Design the “unhappy paths”",
    desc: "Prototype edge cases like error states, loading, retries, and empty dashboards to get consensus before implementation.",
    img: px("/refero/card-02.jpg"),
  },
  {
    title: "Model permissions and access",
    desc: "Test specific roles — admin vs. member, gated actions, restricted views — to evaluate whether the UX actually works.",
    img: px("/refero/card-03.jpg"),
  },
  {
    title: "Prototype time-to-value",
    desc: "Build onboarding flows with branching paths and specific setup steps to measure if a product is understandable.",
    img: px("/refero/card-04.jpg"),
  },
  {
    title: "Replace interpretation with something clickable",
    desc: "Create a shared reference point for the team — no more ambiguity between mockups, tickets, and meetings.",
    img: px("/refero/card-05.jpg"),
  },
];

export default function DesignersPage() {
  return (
    <main className="bg-parchment">
      <section className="relative mb-10 flex min-h-[560px] flex-col items-center overflow-hidden bg-warm-sand md:min-h-[720px]">
        <div className="pointer-events-none absolute top-0 left-1/2 h-full w-[1920px] -translate-x-1/2">
          <div className="fade-up-in absolute top-[124px] left-[600px] p-4 sm:left-[573px]" style={{ animationDelay: "0.1s" }}>
            <div className="h-12 w-44 rounded-lg border-2 border-charcoal/20 bg-linen-border/20" />
          </div>
          <div className="fade-up-in absolute top-[205px] right-[353px] p-4" style={{ animationDelay: "0.25s" }}>
            <div className="flex size-[74px] items-center justify-center rounded-lg bg-charcoal/10">
              <span className="text-3xl font-bold tracking-tighter text-charcoal/70">Aa</span>
            </div>
          </div>
          <div className="fade-up-in absolute bottom-[100px] left-[740px] p-4 sm:bottom-[138px] sm:left-[557px]" style={{ animationDelay: "0.4s" }}>
            <div className="grid grid-cols-2 gap-2">
              <div className="size-10 rounded-full bg-[#4ADE80]" />
              <div className="size-10 rounded-full bg-[#22C55E]" />
              <div className="size-10 rounded-full bg-[#0EA5E9]" />
              <div className="size-10 rounded-full bg-[#38BDF8]" />
            </div>
          </div>
          <div className="fade-up-in absolute top-[192px] left-[32px] p-4" style={{ animationDelay: "0.15s" }}>
            <img
              width={420}
              height={320}
              src={px("/refero/card-06.jpg")}
              alt=""
              aria-hidden="true"
              loading="eager"
              className="h-auto max-w-full rounded-lg"
            />
          </div>
          <div className="fade-up-in absolute right-[32px] -bottom-[57px] p-4" style={{ animationDelay: "0.3s" }}>
            <img
              width={294}
              height={320}
              src={px("/refero/card-07.jpg")}
              alt=""
              aria-hidden="true"
              loading="eager"
              className="h-auto max-w-full rounded-lg"
            />
          </div>
          <div className="fade-up-in absolute right-[640px] bottom-[230px] p-4 sm:right-[443px]" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center -space-x-4">
              {[8, 9, 10].map((n) => (
                <div key={n} className="relative size-16 overflow-hidden rounded-full border-4 border-warm-sand">
                  <img
                    src={px(`/refero/card-${String(n).padStart(2, "0")}.jpg`)}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="fade-up-in relative mt-[180px] flex w-full flex-col items-center gap-6 px-4 text-center md:mt-[224px]" style={{ animationDelay: "0.05s" }}>
          <h1 className="text-xl leading-tight font-medium tracking-tight text-charcoal">Tools for designers</h1>
          <h2 className="leading-tighter text-5xl font-bold tracking-tighter text-charcoal md:text-[80px]">
            Design real products,
            <br />
            not mockups
          </h2>
          <p className="max-w-xl text-balance whitespace-pre-line text-lg font-medium tracking-tight text-charcoal/70">
            Bring your vision to life.{"\n"}Create Freebuff experiences.
          </p>
          <a
            href="/signup"
            className="hero-gradient-btn inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-ink transition-[filter] hover:brightness-110"
          >
            Get started
          </a>
        </div>
      </section>

      <div className="w-full py-5">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <p className="sr-only">Trusted by teams at leading companies</p>
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex w-max animate-marquee items-center gap-x-16 text-charcoal/70 hover:[animation-play-state:paused]">
              {[...TRUSTED_LOGOS, ...TRUSTED_LOGOS].map(({ name, Logo, h }, i) => (
                <Logo key={`${name}-${i}`} className={`${h} w-auto shrink-0`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Section>
        <div className="flex flex-col gap-14 md:gap-20">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-12 ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="overflow-hidden rounded-2xl border border-linen-border bg-warm-sand shadow-sm">
                <img src={f.img} alt={f.title} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
              </div>
              <div>
                <h2 className="text-2xl font-medium tracking-tight text-charcoal md:text-3xl">{f.title}</h2>
                <p className="mt-3 text-lg leading-snug text-charcoal/65">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section narrow eyebrow="FAQ" title="Frequently asked questions">
        <Faq
          items={[
            { q: "Will my Freebuff apps match my design files?", a: "Yes. You have full visual control using React and Tailwind to match your design files exactly. Workspace Themes help you keep consistency across projects." },
            { q: "Can I hand off to developers later?", a: "Yes. Code syncs to GitHub from the start, so developers can review and extend the project at any time." },
            { q: "What tech stack does Freebuff use?", a: "New apps use TanStack Start (a React framework) with server-side rendering, deployed on Cloudflare Workers. Projects use Supabase for database, authentication, storage, and real-time. Apps built before May 2026 run on standard React/Tailwind." },
            { q: "How is this different from Figma prototyping?", a: "Figma creates static, clickable prototypes. Freebuff produces working, full-stack code — including databases, authentication, APIs, and integrations." },
            { q: "How is this different from Webflow or Framer?", a: "Freebuff focuses on building full-stack applications with backends, while Webflow and Framer are primarily designed for marketing sites." },
          ]}
        />
      </Section>
      <CtaBand title="Ready to bring your idea to life?" />
    </main>
  );
}
