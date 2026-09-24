import { Reveal } from "@/components/site/sections";

const solutions = [
  {
    title: "Founders",
    desc: "Go from idea to MVP in days",
    body: "Your AI cofounder and dev team. Describe what you want — Freebuff designs it, builds it, and ships it with you. Full stack, production ready, and entirely yours.",
    features: [
      "Ship MVP in days, not months",
      "No need for technical cofounder",
      "Full-stack production ready",
      "Iterate in real time with AI",
      "Scale from prototype to business",
    ],
    href: "/founders",
  },
  {
    title: "Enterprise",
    desc: "Secure, scalable AI development",
    body: "Freebuff runs on enterprise-grade infrastructure — so you can create full-stack software that scales. Meet security and compliance requirements with automatic scans and audit logs.",
    features: [
      "Enterprise-grade infrastructure",
      "Automatic security scans",
      "Audit logs and compliance",
      "SSO & role controls",
      "Centralized billing",
      "Priority support",
    ],
    href: "/enterprise",
  },
  {
    title: "Agencies",
    desc: "Ship client projects faster",
    body: "Build and manage your clients' projects with AI. From landing pages to web apps — Freebuff handles hosting, SSL, and backend infrastructure. Your code and data stay yours.",
    features: [
      "Ship client projects faster",
      "White-label deployments",
      "Custom domains per client",
      "Private projects",
      "GitHub sync & code export",
    ],
    href: "/partners/solution",
  },
  {
    title: "Product Managers",
    desc: "Prototype without the backlog",
    body: "Describe what you want — Freebuff builds it. Prototype features, validate ideas, and iterate with your team in real time. No backlog, no dependencies, no waiting.",
    features: [
      "Quick prototyping",
      "Validate ideas fast",
      "Real-time collaboration",
      "No technical debt",
      "Ship to production when ready",
    ],
    href: "/product-managers",
  },
  {
    title: "Designers",
    desc: "Turn designs into real products",
    body: "Describe your design vision in plain language. Freebuff builds it — pixel-perfect, responsive, and ready to ship. Focus on design, let AI handle the code.",
    features: [
      "Design-to-code in minutes",
      "Pixel-perfect output",
      "Responsive by default",
      "Iterate in real time",
      "Export code when ready",
    ],
    href: "/designers",
  },
  {
    title: "Marketers",
    desc: "Launch pages without devs",
    body: "Build landing pages, campaign sites, and marketing sites without waiting for development. Describe what you want — Freebuff builds it. Connect your analytics, launch, and measure.",
    features: [
      "Launch pages in minutes",
      "No dev team needed",
      "Connect analytics",
      "A/B test variants",
      "SEO-ready by default",
    ],
    href: "/marketers",
  },
];

export const metadata = {
  title: "Solutions | Freebuff",
  description: "Find the right solution for your role. Founders, enterprise, agencies, product managers, designers, marketers.",
};

export default function SolutionsPage() {
  return (
    <main className="flex-1">
        {/* Hero */}
        <section className="bg-parchment py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-body font-semibold text-charcoal">Solutions</p>
            <h1 className="mt-4 text-[clamp(44px,6vw,72px)] font-w480 leading-[1.02] tracking-[-1.5px] text-charcoal">
              Build with Freebuff, whatever your role
            </h1>
            <p className="mt-6 max-w-[520px] text-body text-dim-gray">
              Whether you&apos;re a founder, enterprise team, agency, product manager, designer, or marketer — Freebuff helps you build better, faster.
            </p>
          </div>
        </section>

        {/* Solutions grid */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {solutions.map((s) => (
                <Reveal key={s.title}>
                  <div className="flex flex-col rounded-3xl border border-linen-border bg-white p-8 shadow-subtle">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-warm-sand">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 text-charcoal" fill="none">
                        <path
                          d="M5 12l6 6 8-11"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <h3 className="mt-6 text-heading font-w480 text-charcoal">{s.title}</h3>
                    <p className="mt-2 text-body text-dim-gray">{s.desc}</p>
                    <p className="mt-4 text-body text-charcoal">{s.body}</p>
                    <ul className="mt-6 space-y-3">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-body text-charcoal">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5 shrink-0 fill-none stroke-charcoal stroke-[2] stroke-linecap-round stroke-linejoin-round"
                            aria-hidden="true"
                          >
                            <path d="M5 12l6 6 8-11" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={s.href}
                      className="mt-8 inline-flex items-center justify-center rounded-buttons bg-charcoal/88 px-5 py-2.5 text-[15px] text-parchment transition-colors hover:bg-charcoal"
                    >
                      Learn more
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-b from-pink-500/20 to-orange-500/20 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-[clamp(40px,5vw,64px)] font-w480 leading-[0.95] tracking-[-1.5px] text-charcoal">
              Ready to build?
            </h2>
            <p className="mt-4 max-w-[420px] mx-auto text-body text-dim-gray">
              Join millions of builders who use Freebuff to turn ideas into reality.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/new"
                className="rounded-buttons bg-charcoal/88 px-6 py-3 text-[15px] font-semibold text-parchment transition-colors hover:bg-charcoal"
              >
                Get started free
              </a>
              <a
                href="/enterprise"
                className="rounded-buttons border border-linen-border px-6 py-3 text-[15px] text-charcoal transition-colors hover:border-stone"
              >
                Talk to sales
              </a>
            </div>
          </div>
        </section>
    </main>
  );
}
