import { CtaBand, Faq, FeatureGrid, Section } from "@/components/site/inner";
import { px } from "@/lib/img";

const PEOPLE = ["Adam", "Eva", "Nabila", "Dan", "Daniel", "Rafael", "Ellie"].map((n) => ({
  name: n,
  src: px(`https://lovable.dev/cdn-cgi/image/width=640,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/community/testimonials/${n}.jpg`),
}));

export default function CommunityPage() {
  return (
    <main className="bg-parchment">
      <section className="bg-marketing-muted relative overflow-x-clip">
        <div className="relative z-10 flex flex-col items-center gap-16 px-6 pt-[120px] md:h-[1280px] md:pt-0">
          <div className="relative z-30 mt-0 flex flex-col items-center gap-8 md:mt-[180px]">
            <a
              href="https://community.lovable.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group/announcement-pill flex items-center gap-2 rounded-full bg-white/40 py-2 pe-3 ps-3 text-sm font-medium backdrop-blur-[10px] transition-all duration-300 hover:bg-white/60"
            >
              <span className="text-balance">Join the community</span>
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 shrink-0 transition-transform duration-300 group-hover/announcement-pill:translate-x-0.5" aria-hidden="true">
                <path d="M13.4702 6.47028C13.7631 6.17739 14.2379 6.17739 14.5308 6.47028L19.5308 11.4703C19.6714 11.6109 19.7505 11.8016 19.7505 12.0006C19.7505 12.1995 19.6714 12.3902 19.5308 12.5308L14.5308 17.5308C14.2379 17.8237 13.7631 17.8237 13.4702 17.5308C13.1773 17.2379 13.1773 16.7632 13.4702 16.4703L17.1899 12.7506H5.00049C4.58627 12.7506 4.25049 12.4148 4.25049 12.0006C4.25049 11.5863 4.58627 11.2506 5.00049 11.2506H17.1899L13.4702 7.53083C13.1773 7.23793 13.1773 6.76317 13.4702 6.47028Z" fill="currentColor" />
              </svg>
            </a>
            <h1 className="leading-tighter text-center text-5xl font-bold tracking-tighter md:text-[80px]">
              <span className="inline-block">Welcome to the</span>
              <br />
              <span className="inline-block">Lovable community</span>
            </h1>
            <div className="flex flex-col items-center justify-center gap-8">
              <p className="text-marketing-muted-foreground max-w-2xl text-balance text-center text-lg font-medium leading-tight tracking-tight sm:text-xl">
                Build the future with thousands of creators, founders, and dreamers. Whether you&apos;re brand new or a professional vibe coder, there&apos;s a place for you here.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <a href="https://community.lovable.app/events" target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center rounded-full bg-charcoal px-5 text-sm font-medium text-white">
                  Browse events
                </a>
                <a href="https://discord.com/invite/lovable-dev" target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center rounded-full border border-linen-border bg-white px-5 text-sm font-medium text-charcoal">
                  Join Lovable on Discord
                </a>
              </div>
            </div>
          </div>
          <div className="pointer-events-none relative mx-auto h-[600px] min-w-[342px] md:absolute md:z-10 md:h-full md:min-w-[1440px]">
            <div className="absolute left-[55px] top-0 md:left-[10.5%] md:top-[690px]">
              <div className="rounded-2xl border border-black/10 bg-white p-2" style={{ transform: "rotate(-3deg)" }}>
                <div className="relative h-[285px] w-[214px] overflow-hidden rounded-xl md:h-[244px] md:w-[326px]">
                  <img alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" fetchPriority="high" decoding="sync" sizes="(min-width: 768px) 326px, 246px" srcSet={`${px("https://lovable.dev/cdn-cgi/image/width=640,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/community/hero/community-hero-image-1.jpg")} 640w, ${px("https://lovable.dev/cdn-cgi/image/width=1920,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/community/hero/community-hero-image-1.jpg")} 1920w, ${px("https://lovable.dev/cdn-cgi/image/width=3840,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/community/hero/community-hero-image-1.jpg")} 3840w`} src={px("https://lovable.dev/cdn-cgi/image/width=3840,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/community/hero/community-hero-image-1.jpg")} />
                </div>
              </div>
            </div>
            <div className="absolute -left-[49px] top-[406px] md:left-[41%] md:top-[680px]">
              <div className="rounded-2xl border border-black/10 bg-white p-2" style={{ transform: "rotate(-6deg)" }}>
                <div className="relative h-[320px] w-[246px] overflow-hidden rounded-xl md:h-[381px] md:w-[286px]">
                  <img alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" sizes="(min-width: 768px) 326px, 246px" srcSet={`${px("https://lovable.dev/cdn-cgi/image/width=640,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/community/hero/community-hero-image-2.jpg")} 640w, ${px("https://lovable.dev/cdn-cgi/image/width=3840,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/community/hero/community-hero-image-2.jpg")} 3840w`} src={px("https://lovable.dev/cdn-cgi/image/width=3840,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/community/hero/community-hero-image-2.jpg")} />
                </div>
              </div>
            </div>
            <div className="absolute left-[259px] top-[115px] md:left-auto md:right-[16%] md:top-[710px]">
              <div className="rounded-2xl border border-black/10 bg-white p-2" style={{ transform: "rotate(4deg)" }}>
                <div className="relative h-[221px] w-[166px] overflow-hidden rounded-xl md:h-[285px] md:w-[214px]">
                  <img alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" fetchPriority="high" decoding="sync" sizes="(min-width: 768px) 326px, 246px" srcSet={`${px("https://lovable.dev/cdn-cgi/image/width=640,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/community/hero/community-hero-image-3.jpg")} 640w, ${px("https://lovable.dev/cdn-cgi/image/width=3840,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/community/hero/community-hero-image-3.jpg")} 3840w`} src={px("https://lovable.dev/cdn-cgi/image/width=3840,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/community/hero/community-hero-image-3.jpg")} />
                </div>
              </div>
            </div>
            <div className="absolute -left-[144px] top-[245px] md:left-[19%] md:top-[1010px]">
              <div className="rounded-2xl border border-black/10 bg-white p-2" style={{ transform: "rotate(2deg)" }}>
                <div className="relative h-[184px] w-[246px] overflow-hidden rounded-xl md:h-[244px] md:w-[326px]">
                  <img alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" sizes="(min-width: 768px) 326px, 246px" srcSet={`${px("https://lovable.dev/cdn-cgi/image/width=640,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/community/hero/community-hero-image-4.jpg")} 640w, ${px("https://lovable.dev/cdn-cgi/image/width=3840,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/community/hero/community-hero-image-4.jpg")} 3840w`} src={px("https://lovable.dev/cdn-cgi/image/width=3840,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/community/hero/community-hero-image-4.jpg")} />
                </div>
              </div>
            </div>
            <div className="absolute left-[185px] top-[417px] md:left-auto md:right-[18%] md:top-[1030px]">
              <div className="rounded-2xl border border-black/10 bg-white p-2" style={{ transform: "rotate(-4deg)" }}>
                <div className="relative h-[184px] w-[246px] overflow-hidden rounded-xl md:h-[244px] md:w-[326px]">
                  <img alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" sizes="(min-width: 768px) 326px, 246px" srcSet={`${px("https://lovable.dev/cdn-cgi/image/width=640,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/community/hero/community-hero-image-5.jpg")} 640w, ${px("https://lovable.dev/cdn-cgi/image/width=3840,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/community/hero/community-hero-image-5.jpg")} 3840w`} src={px("https://lovable.dev/cdn-cgi/image/width=3840,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/community/hero/community-hero-image-5.jpg")} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section eyebrow="Get involved" title="Real builders, real community, real impact">
        <FeatureGrid
          items={[
            { title: "Join online", desc: "Chat daily with builders, share what you ship and get unstuck fast in Discord." },
            { title: "Join IRL", desc: "Meetups, hackathons and launch nights in cities around the world." },
            { title: "Become a community leader", desc: "Host events, run a local chapter and help new builders find their footing." },
            { title: "Partner with Lovable", desc: "Agencies, schools and nonprofits building programs on Lovable." },
          ]}
        />
      </Section>

      <Section narrow eyebrow="Faces" title="Builders everywhere">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {PEOPLE.map((p) => (
            <div key={p.name} className="flex flex-col items-center gap-2">
              <img src={p.src} alt={p.name} loading="lazy" decoding="async" className="h-20 w-20 rounded-full border border-black/10 object-cover md:h-24 md:w-24" />
              <span className="text-sm font-medium text-charcoal">{p.name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section narrow eyebrow="Events" title="Join or host a Lovable community event near you">
        <div id="events" className="scroll-mt-24 rounded-2xl border border-black/10 bg-white p-6 text-center md:p-8">
          <p className="font-medium text-charcoal">hackathons · meetups · launch nights</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-steel">New events go up every week. Bring an idea — leave with a shipped project and new friends.</p>
        </div>
      </Section>

      <Section narrow eyebrow="FAQ" title="Frequently asked questions">
        <Faq items={[{ q: "Is the community free to join?", a: "Yes. Discord, events and templates are free — you only pay if you need a paid Lovable plan for bigger builds." }, { q: "How do I host an event?", a: "Pick a date and a venue, tell us the plan, and we'll help with promotion, swag and a building challenge." }, { q: "Where do I share what I built?", a: "Post it in the showcase channel and publish it as a remixable template so others can learn from it." }]} />
      </Section>
      <CtaBand />
    </main>
  );
}
