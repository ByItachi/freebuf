import { CompareTable, CtaBand, Faq, InnerHero, Section } from "@/components/site/inner";
import { px } from "@/lib/img";

const CD = px("https://lovable.dev/cdn-cgi/image/width=2000,f=auto,fit=scale-down");

export default function ComparePage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Comparison"
        title="Comparing Bolt vs. Lovable"
        sub="Two prompt-to-app builders, compared on what actually matters: design, backends and iteration."
        primary={{ label: "Try Lovable free", href: "/new" }}
      />
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="flex items-center gap-3 border-b border-black/5 px-5 py-4">
              <img
                src={px("https://lovable.dev/cdn-cgi/image/width=200,f=auto,fit=scale-down/https://assets.lovable.dev/img/marketing-content/landing/bolt-vs-lovable/bolt-logo.png")}
                alt="Bolt"
                loading="lazy"
                className="h-6 w-auto"
              />
              <span className="font-medium text-charcoal">Bolt</span>
            </div>
            <img
              src={`${CD}/https://assets.lovable.dev/img/marketing-content/landing/bolt-vs-lovable/bolt-dashboard.png`}
              alt="Bolt dashboard"
              loading="lazy"
              decoding="async"
              className="aspect-[16/10] w-full object-cover object-top"
            />
          </div>
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="flex items-center gap-3 border-b border-black/5 px-5 py-4">
              <img
                src={px("https://lovable.dev/cdn-cgi/image/width=200,f=auto,fit=scale-down/img/lovable-light-png.png")}
                alt="Lovable"
                loading="lazy"
                className="h-6 w-auto"
              />
              <span className="font-medium text-charcoal">Lovable</span>
            </div>
            <img
              src={`${CD}/https://assets.lovable.dev/img/marketing-content/landing/bolt-vs-lovable/lovable-dashboard.png`}
              alt="Lovable dashboard"
              loading="lazy"
              decoding="async"
              className="aspect-[16/10] w-full object-cover object-top"
            />
          </div>
        </div>
      </section>

      <Section eyebrow="Head to head" title="Capability Comparison">
        <CompareTable
          cols={["Lovable", "Bolt"]}
          rows={[
            { label: "Prompt to full app in seconds", values: [true, true] },
            { label: "Backend: auth, database, storage", values: [true, "Partial"] },
            { label: "Visual edits (click to edit)", values: [true, false] },
            { label: "Version restore & branching", values: [true, true] },
            { label: "Custom domains + hosting included", values: [true, true] },
            { label: "GitHub sync & code export", values: [true, true] },
            { label: "Remixable community templates", values: [true, false] },
          ]}
        />
      </Section>
      <Section eyebrow="Details" title="Features Comparison">
        <CompareTable
          cols={["Lovable", "Bolt"]}
          rows={[
            { label: "Free tier to start", values: [true, true] },
            { label: "Team workspaces & roles", values: [true, "Limited"] },
            { label: "SSO & audit logs", values: [true, false] },
            { label: "Figma import", values: [true, false] },
            { label: "Supabase integration", values: [true, true] },
          ]}
        />
      </Section>
      <Section narrow eyebrow="FAQ" title="Frequently Asked Questions">
        <Faq
          items={[
            { q: "Can I import my Bolt project?", a: "Yes — connect GitHub or paste your code in, describe what you want next, and keep iterating in Lovable." },
            { q: "Which is better for backends?", a: "Lovable generates auth, database, storage and edge functions from the same prompt, so full-stack apps come together faster." },
            { q: "Do I own my code?", a: "Yes. Sync to GitHub any time and export everything — your code and data stay yours." },
          ]}
        />
      </Section>
      <Section eyebrow="See for yourself" title="Idea to app in seconds">
        <div className="mx-auto max-w-3xl rounded-2xl border border-black/10 bg-white p-6 text-center md:p-10">
          <p className="text-lg leading-snug text-steel">
            The fastest comparison is a bake-off: build the same page in both tools and judge the
            third iteration — not just the first.
          </p>
        </div>
      </Section>
      <CtaBand />
    </main>
  );
}
