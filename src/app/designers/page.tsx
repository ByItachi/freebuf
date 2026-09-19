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

const CD = px("https://lovable.dev/cdn-cgi/image/width=1284,f=auto,fit=scale-down");
const AV = px("https://lovable.dev/cdn-cgi/image/width=200,f=auto,fit=scale-down");

const FEATURES = [
  { img: `${CD}/https://assets.lovable.dev/img/marketing-content/audiences/designers/prototype-behavior.webp`, title: "Prototype behavior, not just layout", desc: "Static screens can't simulate missing data, user errors, or changing permissions. Test interaction decisions with real logic and state." },
  { img: `${CD}/https://assets.lovable.dev/img/marketing-content/audiences/designers/unhappy-paths.webp`, title: "Design the \u201cunhappy paths\u201d", desc: "Prototype edge cases like error states, loading, retries, and empty dashboards to get consensus before implementation." },
  { img: `${CD}/https://assets.lovable.dev/img/marketing-content/audiences/designers/permissions-access.webp`, title: "Model permissions and access", desc: "Test specific roles — admin vs. member, gated actions, restricted views — to evaluate whether the UX actually works." },
  { img: `${CD}/https://assets.lovable.dev/img/marketing-content/audiences/designers/time-to-value.webp`, title: "Prototype time-to-value", desc: "Build onboarding flows with branching paths and specific setup steps to measure if a product is understandable." },
  { img: `${CD}/https://assets.lovable.dev/img/marketing-content/audiences/designers/clickable-prototype.webp`, title: "Replace interpretation with something clickable", desc: "Create a shared reference point for the team — no more ambiguity between mockups, tickets, and meetings." },
];

export default function DesignersPage() {
  return (
    <main className="bg-parchment">
      <section className="relative mb-10 flex min-h-[560px] flex-col items-center overflow-hidden bg-[#F4F3EF] md:min-h-[720px]">
        <div className="pointer-events-none absolute top-0 left-1/2 h-full w-[1920px] -translate-x-1/2">
          <div className="fade-up-in absolute top-[124px] left-[600px] p-4 sm:left-[573px]" style={{ animationDelay: "0.1s" }}>
            <div className="h-12 w-44 rounded-lg border-2 border-black" />
          </div>
          <div className="fade-up-in absolute top-[205px] right-[353px] p-4" style={{ animationDelay: "0.25s" }}>
            <svg width="107" height="73" viewBox="0 0 107 73" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M79.5652 72.0736C76.3794 72.0736 73.5057 71.466 70.9439 70.2508C68.3822 69.0028 66.3623 67.2293 64.8844 64.9303C63.4393 62.6313 62.7168 59.9546 62.7168 56.9002C62.7168 52.2037 64.129 48.5581 66.9535 45.9635C69.8108 43.3361 73.8012 41.6119 78.9247 40.7908L87.1026 39.4607C89.2045 39.0994 90.8467 38.7053 92.029 38.2783C93.2113 37.8185 94.0817 37.2274 94.64 36.5048C95.1983 35.7494 95.4775 34.7477 95.4775 33.4997C95.4775 32.1203 95.0998 30.8066 94.3444 29.5586C93.589 28.3105 92.4231 27.2924 90.8467 26.5042C89.2702 25.716 87.3161 25.3218 84.9842 25.3218C81.6999 25.3218 79.0232 26.1922 76.9541 27.9328C74.9179 29.6407 73.8012 32.0054 73.6042 35.0269H64.0962C64.1947 31.7426 65.1307 28.8032 66.9043 26.2086C68.6778 23.5812 71.1246 21.5285 74.2446 20.0506C77.3647 18.5398 80.9445 17.7844 84.9842 17.7844C89.0896 17.7844 92.6202 18.5234 95.576 20.0013C98.5319 21.4464 100.782 23.5648 102.325 26.3564C103.902 29.148 104.69 32.4816 104.69 36.357V58.723C104.69 61.1205 104.854 63.3374 105.183 65.3736C105.544 67.3771 106.053 68.6579 106.71 69.2162V70.6449H97.1032C96.7091 69.2327 96.3807 67.5905 96.1179 65.7185C95.888 63.8136 95.7731 61.958 95.7731 60.1516L97.3988 60.6443C96.6106 62.7791 95.3625 64.7168 93.6547 66.4575C91.9469 68.1981 89.8778 69.5775 87.4474 70.5956C85.0171 71.5809 82.3896 72.0736 79.5652 72.0736ZM81.585 64.4869C84.4423 64.4869 86.9384 63.8465 89.0731 62.5656C91.2079 61.2519 92.8336 59.4948 93.9503 57.2943C95.0998 55.061 95.6745 52.5814 95.6745 49.8554V42.1702L96.7091 42.318C95.7567 43.4018 94.5415 44.2557 93.0635 44.8797C91.6185 45.5037 89.6643 46.0621 87.2011 46.5547L81.782 47.6385C78.4649 48.3282 76.0346 49.3792 74.4909 50.7914C72.9473 52.1708 72.1755 54.1086 72.1755 56.6046C72.1755 59.0021 73.0623 60.9234 74.8358 62.3685C76.6421 63.7808 78.8919 64.4869 81.585 64.4869Z" fill="black" />
              <path d="M25.4696 0H36.4555L61.6788 70.6449H51.6781L30.0019 7.38963H31.7261L9.80358 70.6449H0L25.4696 0ZM14.1388 40.8893H48.5745V49.1657H14.1388V40.8893Z" fill="black" />
            </svg>
          </div>
          <div className="fade-up-in absolute bottom-[100px] left-[740px] p-4 sm:bottom-[138px] sm:left-[557px]" style={{ animationDelay: "0.4s" }}>
            <div className="grid grid-cols-2 gap-2">
              <div className="size-10 rounded-full bg-black" />
              <div className="size-10 rounded-full bg-[#FFA6F9]" />
              <div className="size-10 rounded-full bg-pink-600" />
              <div className="size-10 rounded-full bg-yellow-400" />
            </div>
          </div>
          <div className="fade-up-in absolute top-[192px] left-[32px] p-4" style={{ animationDelay: "0.15s" }}>
            <img
              width={420}
              height={320}
              src={px("https://lovable.dev/cdn-cgi/image/width=840,f=auto,fit=scale-down/https://assets.lovable.dev/img/marketing-content/audiences/designers/hero/gradient-1.jpg")}
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
              src={px("https://lovable.dev/cdn-cgi/image/width=588,f=auto,fit=scale-down/https://assets.lovable.dev/img/marketing-content/audiences/designers/hero/gradient-2.jpg")}
              alt=""
              aria-hidden="true"
              loading="eager"
              className="h-auto max-w-full rounded-lg"
            />
          </div>
          <div className="fade-up-in absolute right-[640px] bottom-[230px] p-4 sm:right-[443px]" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center -space-x-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="relative size-16 overflow-hidden rounded-full border-4 border-[#F4F3EF]">
                  <img
                    src={`${AV}/https://assets.lovable.dev/img/marketing-content/audiences/designers/hero/avatar-${n}.png`}
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
            Bring your vision to life.{"\n"}Create Lovable experiences.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal"
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
              <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
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
            { q: "Will my Lovable apps match my design files?", a: "Yes. You have full visual control using React and Tailwind to match your design files exactly. Workspace Themes help you keep consistency across projects." },
            { q: "Can I hand off to developers later?", a: "Yes. Code syncs to GitHub from the start, so developers can review and extend the project at any time." },
            { q: "What tech stack does Lovable use?", a: "New apps use TanStack Start (a React framework) with server-side rendering, deployed on Cloudflare Workers. Projects use Supabase for database, authentication, storage, and real-time. Apps built before May 2026 run on standard React/Tailwind." },
            { q: "How is this different from Figma prototyping?", a: "Figma creates static, clickable prototypes. Lovable produces working, full-stack code — including databases, authentication, APIs, and integrations." },
            { q: "How is this different from Webflow or Framer?", a: "Lovable focuses on building full-stack applications with backends, while Webflow and Framer are primarily designed for marketing sites." },
          ]}
        />
      </Section>
      <CtaBand title="Ready to bring your idea to life?" />
    </main>
  );
}
