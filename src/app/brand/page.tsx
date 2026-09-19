import { CtaBand, InnerHero, Section } from "@/components/site/inner";

const COLORS = [
  { name: "Parchment", hex: "#FCFBF8" },
  { name: "Charcoal", hex: "#1C1C1C" },
  { name: "Warm Sand", hex: "#F7F4ED" },
  { name: "Heart Blue", hex: "#4B73FF" },
  { name: "Heart Pink", hex: "#FF66F4" },
  { name: "Heart Orange", hex: "#FE7B02" },
];

export default function BrandPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Brand"
        title="Lovable Press & Media Resources"
        sub="Logos, colors and guidance for writing about Lovable."
        primary={{ label: "Download logo kit", href: "/new" }}
      />
      <Section eyebrow="Colors" title="Brand palette">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {COLORS.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-2xl border border-black/10 bg-white">
              <div className="h-20" style={{ backgroundColor: c.hex }} aria-hidden="true" />
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-charcoal">{c.name}</span>
                <span className="text-xs text-steel">{c.hex}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section narrow eyebrow="Rules" title="Use it well">
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-[15px] leading-relaxed text-steel md:p-8">
          <p>
            Don&apos;t stretch, recolor or rearrange the mark. Give it room to breathe, keep it on
            light backgrounds where possible, and never imply endorsement without permission.
            Questions? Reach out to press before publishing.
          </p>
        </div>
      </Section>
      <CtaBand />
    </main>
  );
}
