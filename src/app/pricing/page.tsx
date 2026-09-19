"use client";

import { useState } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    period: "/month",
    description: "Discover what Lovable can do for you",
    popular: false,
    note: "No credit card needed",
    features: [
      "Workspace-private projects",
      "Unlimited collaborators",
      "5 lovable.app domains",
      "Cloud",
      "Community support",
    ],
    cta: "Get started",
    href: "/signup",
    badge: null,
  },
  {
    name: "Pro",
    monthlyPrice: "$25",
    yearlyPrice: "$21",
    period: "/month",
    description: "Designed for fast-moving teams building together in real time.",
    popular: true,
    note: "100 monthly credits",
    features: [
      "Unlimited users",
      "All Free features",
      "100 Pro credits",
      "Credit rollovers",
      "On-demand credit top-ups",
      "Unlimited lovable.app domains",
      "Custom domains",
      "User roles & permissions",
      "Per-member credit limits",
      "Remove the Lovable badge",
      "Email support",
      "Design systems",
    ],
    cta: "Get started",
    href: "/signup",
    badge: "Most popular",
  },
  {
    name: "Business",
    monthlyPrice: "$50",
    yearlyPrice: "$42",
    period: "/month",
    description: "Advanced controls and power features for growing departments",
    popular: false,
    note: "100 monthly credits",
    features: [
      "Unlimited users",
      "All Pro features",
      "100 Business credits",
      "Team workspace",
      "Role-based access",
      "Internal publish",
      "Personal projects",
      "SSO",
      "Security center",
      "Design templates",
      "Priority support",
    ],
    cta: "Get started",
    href: "/signup",
    badge: null,
  },
  {
    name: "Enterprise",
    monthlyPrice: "$680",
    yearlyPrice: "$680",
    period: "/month",
    description: "Built for large orgs needing flexibility, scale, and governance.",
    popular: false,
    note: "Platform fee · Volume based pricing",
    features: [
      "Unlimited users",
      "All Business features",
      "Directory sync (SCIM)",
      "Audit logs",
      "Restrict who publishes and invites",
      "Auto-retire abandoned apps",
      "Scheduled deep security scans",
      "Sensitive data detection and control",
      "Advanced design systems support",
      "Git sync data residency",
      "GitHub Enterprise, cloud or self-hosted",
      "Private npm registry",
      "Named CSM, onboarding and deployment",
      "Custom SLA",
    ],
    cta: "Book a demo",
    href: "/enterprise-form",
    badge: null,
  },
];

const audiences = [
  {
    name: "Lovable for students",
    description: "Verify student status and get access to up to 50% off Lovable Pro.",
    cta: "Get started",
    href: "/students",
  },
  {
    name: "Lovable for campus",
    description: "Billing and administrative controls for universities and colleges.",
    cta: "Contact sales",
    href: "/enterprise-form",
  },
  {
    name: "Lovable for kids",
    description: "Compliant access & curriculum for schools in partnership with imagi.",
    cta: "Learn more",
    href: "/classroom",
  },
];

const faqs = [
  {
    q: "What is Lovable and how does it work?",
    a: "Lovable is an AI software engineer, which enables anyone to build for the web. Simply chat to instantly build websites and web apps, with no technical knowledge needed.",
  },
  {
    q: "What is a credit?",
    a: "Credits are units Lovable uses to measure and pay for usage across your workspace. Credits let you build apps, run deployed apps, and power AI features from one balance. The value of a credit and the rate at which they are consumed for a given action depend on your subscription plan and the feature used, and credits are not necessarily equal in value across different plans.",
  },
  {
    q: "How do I use credits in Lovable?",
    a: "Paid plans have access to a credit balance. Credits from your balance can be used in Lovable for building by sending messages to Lovable, hosting with Cloud, and offering AI features to users as part of your app. In addition to your credit balance, Pro and Business subscriptions include grants for building and hosting with Cloud. For building, pricing varies by mode: Default Mode credits vary based on task complexity, while Plan Mode costs 1 credit per message. For example, \"Make the button gray\" costs about 0.50 credits, \"Remove the footer\" about 0.90, \"Add authentication with sign up and login\" about 1.20, and \"Build me a landing page, use images\" about 1.70. You can see the cost of each message in the message history by hovering over the three dots of a message.",
  },
  {
    q: "Do credits expire?",
    a: "Yes. If unused, monthly plan credits expire two (2) months after they're issued, and annual plan credits expire one (1) month after your annual period ends. Top-up credits last twelve (12) months from purchase. Included grants of daily build credits expire at the end of each day and don't roll over.",
  },
  {
    q: "What happens to my credits if my subscription ends?",
    a: "If you cancel your plan, you can keep using your remaining credits until the end of your current billing period. After that, your plan switches to Free and you only have access to grants included in the free plan. If your workspace has unused paid credits left, they will reactivate if you re-subscribe to any plan at any point before expiry.",
  },
  {
    q: "Are credits refundable?",
    a: "No. Credits aren't refundable or redeemable for cash or any other value.",
  },
  {
    q: "What is included in free and paid plans?",
    a: "Starting to build on Lovable is free. The free plan includes a daily grant of 5 build credits (up to 30 a month), plus monthly grants of 20 Cloud credits. The free plan also grants 4 credits usable by AI features built into user apps, to try the feature before subscribing. Paid subscribers get their plan's credits added to their balance monthly. This balance can be used flexibly to cover building, Cloud, and AI features in user apps. On top, subscriptions include daily grants of 5 build credits and a monthly grant of 20 Cloud credits.",
  },
  {
    q: "How do I buy credits for a team, class, or community?",
    a: "Every Lovable plan belongs to a workspace, and everyone you invite into that workspace shares its credits. To fund a group of people, upgrade one workspace to a plan with enough monthly credits for everyone, then invite the whole group. Everyone builds from the shared credit pool on one subscription and one invoice, and each member can work on as many of their own projects as they want.",
  },
  {
    q: "Do you charge per seat or per user?",
    a: "No. Workspaces support unlimited members on all plans, and plans are priced by the credits they include, not by seats. Inviting more people doesn't change your subscription cost; what changes is how quickly the group uses the workspace's shared credits.",
  },
  {
    q: "How much does it cost to run my app on Lovable?",
    a: "For most users with smaller or new apps, hosting (running an app on Lovable) does not cost anything: In most cases, the cost to publish, view, and keep your app running will be minimal and fully covered by the included grant that comes with your subscription. Apps that reach significant visitor traffic and/or size may start incurring cost on top of the included grant, which is covered by your credit balance.",
  },
  {
    q: "Why is the Business plan more expensive?",
    a: "The higher price reflects the additional features Business adds on top of Pro for teams and larger organizations. Important: The cost for running their app and for AI features built into apps is the same for Business and Pro subscribers and not more expensive on the business plan.",
  },
  {
    q: "Who owns the projects and code?",
    a: "You do. You own your code, which means the apps, websites, and other projects you build with Lovable, customer data stored in Lovable, as well as any AI output you generate in Lovable. (This is subject to any third-party rights in the underlying AI models.)",
  },
  {
    q: "Do you offer a student discount?",
    a: "Yes, we offer a student discount for students with a valid student email. You can read more and claim your discount on lovable.dev/students. Make sure you are logged in with your university email address.",
  },
  {
    q: "Where can I find out more?",
    a: "Join the community on Discord or read up more on our documentation.",
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <main className="flex-1 bg-black">
      {/* Hero */}
      <section className="bg-black py-20 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-[14px] font-semibold text-white/70 tracking-[0.05em] uppercase">Pricing</p>
          <h1 className="mt-4 text-[clamp(48px,7vw,72px)] font-w480 leading-[0.95] tracking-[-2px] text-white">
            Start for free. Upgrade to get the capacity that exactly matches your team&apos;s needs.
          </h1>

          {/* Billing toggle */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`text-[15px] ${!isYearly ? "text-white" : "text-white/60"}`}>Monthly</span>
            <button
              type="button"
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-white/20 bg-white/5 p-0.5 transition-colors hover:border-white/40"
              role="switch"
              aria-checked={isYearly}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                  isYearly ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-[15px] ${isYearly ? "text-white" : "text-white/60"}`}>
              Yearly <span className="font-semibold">2 months free</span>
            </span>
          </div>
        </div>
      </section>

      {/* Plan cards */}
      <section className="bg-black py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 lg:grid-cols-4">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative flex flex-col rounded-3xl border border-white/10 bg-[#111111] p-8 ${
                  plan.popular ? "border-white/30 ring-2 ring-white/10" : ""
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-[13px] font-semibold text-black">
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-[20px] font-w480 text-white">{plan.name}</h3>
                <p className="mt-2 text-[15px] text-white/60">{plan.description}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-w480 text-white">
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-[15px] text-white/60">{plan.period}</span>
                </div>

                {plan.note && (
                  <p className="mt-1 text-[14px] text-white/50">{plan.note}</p>
                )}

                <ul className="mt-8 space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[15px] text-white/85">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 shrink-0 fill-none stroke-white stroke-[2] stroke-linecap-round stroke-linejoin-round"
                        aria-hidden="true"
                      >
                        <path d="M5 12l6 6 8-11" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-8 block w-full rounded-buttons px-4 py-3 text-center text-[15px] font-semibold transition-colors ${
                    plan.popular
                      ? "bg-white text-black hover:bg-white/90"
                      : "border border-white/20 bg-transparent text-white hover:border-white/40"
                  }`}
                >
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>

          {/* Compare all plans */}
          <div className="mt-8 text-center">
            <Link
              href="/pricing#compare"
              className="text-[15px] text-white/60 underline underline-offset-4 hover:text-white transition-colors"
            >
              Compare all plans
            </Link>
          </div>

          {/* Audience cards */}
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {audiences.map((audience) => (
              <div
                key={audience.name}
                className="flex flex-col rounded-3xl border border-white/10 bg-[#111111] p-8"
              >
                <h3 className="text-[20px] font-w480 text-white">{audience.name}</h3>
                <p className="mt-3 flex-1 text-[15px] text-white/60">{audience.description}</p>
                <a
                  href={audience.href}
                  className="mt-6 inline-block w-fit rounded-buttons border border-white/20 px-4 py-2.5 text-[15px] text-white transition-colors hover:border-white/40"
                >
                  {audience.cta}
                </a>
              </div>
            ))}
          </div>

          {/* Security & compliance */}
          <div className="mt-6 rounded-3xl border border-white/10 bg-[#111111] p-8 text-center">
            <h3 className="text-[36px] font-w480 text-white">Security and compliance</h3>
            <p className="mt-3 text-[15px] text-white/60">
              Enterprise-grade security and compliance certifications.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="/security"
                className="rounded-buttons bg-white px-4 py-2.5 text-[15px] font-semibold text-black transition-colors hover:bg-white/90"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-black py-20 border-y border-white/10">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-[36px] font-w480 text-white text-center">Frequently asked questions</h2>
          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-white/10 bg-[#111111] p-6 transition-colors hover:border-white/30"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none text-[15px] font-semibold text-white">
                  {faq.q}
                  <svg
                    className="h-5 w-5 shrink-0 text-white/50 transition-transform duration-200 group-open:rotate-180"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </summary>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-[15px] text-white/60">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-black py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mx-auto max-w-[20ch] text-[clamp(40px,5vw,64px)] font-w480 leading-[0.95] tracking-[-1.5px] text-white">
            Start building today
          </h2>
          <p className="mt-4 max-w-[420px] mx-auto text-[16px] text-white/60">
            Join millions of builders who use Lovable to turn ideas into reality.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/new"
              className="rounded-buttons bg-white px-6 py-3 text-[15px] font-semibold text-black hover:bg-white/90"
            >
              Get started free
            </a>
            <a
              href="/enterprise"
              className="rounded-buttons border border-white/20 px-6 py-3 text-[15px] text-white transition-colors hover:border-white/40"
            >
              Talk to sales
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
