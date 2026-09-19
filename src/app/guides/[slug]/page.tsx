import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/site/inner";
import { GUIDES, getGuide } from "@/data/guides";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <main className="bg-parchment">
      <article className="mx-auto max-w-3xl px-4 pb-8 pt-16 md:pt-24">
        <Link href="/guides" className="text-sm font-medium text-steel transition-colors hover:text-charcoal">
          ← All guides
        </Link>
        <p className="mt-6 text-[13px] font-medium text-steel">{guide.category}</p>
        <h1 className="mt-2 text-4xl font-medium tracking-tight text-charcoal md:text-5xl">
          {guide.title}
        </h1>
        <p className="mt-4 text-lg leading-snug text-charcoal/65">{guide.excerpt}</p>
        <div className="mt-8 space-y-5">
          {guide.body.map((para, i) => (
            <p key={i} className="text-[17px] leading-relaxed text-steel">
              {para}
            </p>
          ))}
        </div>
      </article>
      <section className="mx-auto max-w-3xl px-4 pb-4">
        <h2 className="text-xl font-medium tracking-tight text-charcoal">Keep reading</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {GUIDES.filter((g) => g.slug !== guide.slug)
            .slice(0, 2)
            .map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="group rounded-2xl border border-black/10 bg-white p-5 transition-colors hover:border-stone"
              >
                <h3 className="font-medium text-charcoal group-hover:underline">{g.title}</h3>
                <p className="mt-1 text-sm text-steel">{g.category}</p>
              </Link>
            ))}
        </div>
      </section>
      <CtaBand />
    </main>
  );
}
