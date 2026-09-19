import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand, InnerHero, Section } from "@/components/site/inner";
import { USE_CASE_SLUGS, titleizeUseCase } from "@/data/usecases";

export function generateStaticParams() {
  return USE_CASE_SLUGS.map((slug) => ({ slug }));
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!USE_CASE_SLUGS.includes(slug)) notFound();
  const title = titleizeUseCase(slug);

  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Use case"
        title={`Build ${title} with AI`}
        sub={`Describe your ${title.toLowerCase()} idea in words — design, database, auth and hosting come together in one build.`}
        primary={{ label: "Start building", href: "/new" }}
        secondary={{ label: "See templates", href: "/templates" }}
      />
      <Section eyebrow="How it works" title={`From prompt to ${title.toLowerCase()}`}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { t: "1. Describe it", d: `List the pages, data and flows your ${title.toLowerCase()} needs.` },
            { t: "2. Refine live", d: "Preview instantly, tweak with chat or click-to-edit." },
            { t: "3. Launch", d: "Publish to a live URL with SSL, then iterate on feedback." },
          ].map((s) => (
            <div key={s.t} className="rounded-2xl border border-black/10 bg-white p-5">
              <h3 className="font-medium text-charcoal">{s.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-steel">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section eyebrow="Keep exploring" title="Related use cases">
        <div className="flex flex-wrap gap-2">
          {USE_CASE_SLUGS.filter((s) => s !== slug)
            .slice(0, 12)
            .map((s) => (
              <Link
                key={s}
                href={`/solutions/use-case/${s}`}
                className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm text-steel transition-colors hover:border-stone hover:text-charcoal"
              >
                {titleizeUseCase(s)}
              </Link>
            ))}
        </div>
      </Section>
      <CtaBand />
    </main>
  );
}
