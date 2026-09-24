import { CtaBand, InnerHero, Section } from "@/components/site/inner";

const COLORS = [
  { name: "Midnight", hex: "#0B1220" },
  { name: "Signal Green", hex: "#22C55E" },
  { name: "Mint Glow", hex: "#4ADE80" },
  { name: "Pulse Sky", hex: "#38BDF8" },
  { name: "Slate Card", hex: "#131C2E" },
  { name: "Slate Line", hex: "#24304A" },
];

export default function BrandPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Brand"
        title="Freebuff Press & Media Resources"
        sub="Logos, colors and guidance for writing about Freebuff."
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
