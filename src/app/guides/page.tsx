import Link from "next/link";
import { CtaBand, InnerHero, Section } from "@/components/site/inner";
import { GUIDES, GUIDE_CATEGORIES } from "@/data/guides";

export default function GuidesPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Guides"
        title="Learn to build anything"
        sub="Comparisons, how-tos and playbooks for shipping with AI."
      />
      {GUIDE_CATEGORIES.map((cat) => (
        <Section key={cat} eyebrow={cat} title={cat}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.filter((g) => g.category === cat).map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="group rounded-2xl border border-black/10 bg-white p-5 transition-colors hover:border-stone"
              >
                <h3 className="font-medium text-charcoal group-hover:underline">{g.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-steel">{g.excerpt}</p>
              </Link>
            ))}
          </div>
        </Section>
      ))}
      <CtaBand />
    </main>
  );
}
