import { CompareTable, CtaBand, Faq, InnerHero, Section } from "@/components/site/inner";
import { FreebuffMark } from "@/components/brand";

export default function ComparePage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Comparison"
        title="Comparing Bolt vs. Freebuff"
        sub="Two prompt-to-app builders, compared on what actually matters: design, backends and iteration."
        primary={{ label: "Try Freebuff free", href: "/new" }}
      />
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="flex items-center gap-3 border-b border-black/5 px-5 py-4">
              <span className="flex size-6 items-center justify-center rounded-md bg-charcoal text-[11px] font-bold text-parchment">
                B
              </span>
              <span className="font-medium text-charcoal">Bolt</span>
            </div>
            <div className="flex aspect-[16/10] items-center justify-center bg-warm-sand/60">
              <div className="w-2/3 space-y-2.5 px-6">
                <div className="h-3 w-1/3 rounded bg-charcoal/15" />
                <div className="h-2.5 w-full rounded bg-charcoal/8" />
                <div className="h-2.5 w-5/6 rounded bg-charcoal/8" />
                <div className="h-2.5 w-4/6 rounded bg-charcoal/8" />
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="flex items-center gap-3 border-b border-black/5 px-5 py-4">
              <FreebuffMark className="size-6" />
              <span className="font-medium text-charcoal">Freebuff</span>
            </div>
            <div className="flex aspect-[16/10] items-center justify-center bg-warm-sand/60">
              <div className="w-2/3 space-y-2.5 px-6">
                <div className="h-3 w-1/2 rounded bg-gradient-to-r from-[#4ADE80] to-[#38BDF8]" />
                <div className="h-2.5 w-full rounded bg-charcoal/8" />
                <div className="h-2.5 w-5/6 rounded bg-charcoal/8" />
                <div className="h-2.5 w-3/6 rounded bg-charcoal/8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section eyebrow="Head to head" title="Capability Comparison">
        <CompareTable
          cols={["Freebuff", "Bolt"]}
          rows={[
            { label: "Prompt to full app in seconds", values: [true, true] },
            { label: "Backend: auth, database, storage", values: [true, "Partial"] },
            { label: "Visual edits (click to edit)", values: [true, false] },
            { label: "Version restore & branching", values: [true, true] },
            { label: "Custom domains + hosting included", values: [true, true] },
            { label: "GitHub sync & code export", values: [true, true] },
            { label: "Desktop app included", values: [true, false] },
          ]}
        />
      </Section>
      <Section eyebrow="Details" title="Features Comparison">
        <CompareTable
          cols={["Freebuff", "Bolt"]}
          rows={[
            { label: "Free tier to start", values: [true, true] },
            { label: "Team workspaces & roles", values: [true, "Limited"] },
            { label: "SSO & audit logs", values: [true, false] },
            { label: "Figma import", values: [true, false] },
            { label: "Bring your own model keys", values: [true, false] },
          ]}
        />
      </Section>
      <Section narrow eyebrow="FAQ" title="Frequently Asked Questions">
        <Faq
          items={[
            { q: "Can I import my Bolt project?", a: "Yes — connect GitHub or paste your code in, describe what you want next, and keep iterating in Freebuff." },
            { q: "Which is better for backends?", a: "Freebuff generates auth, database, storage and edge functions from the same prompt, so full-stack apps come together faster." },
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
