import Link from "next/link";
import { CtaBand, Faq, InnerHero, Section } from "@/components/site/inner";
import { FreebuffMark } from "@/components/brand";
import { px } from "@/lib/img";

const CARDS = [
  {
    title: "Documentation",
    desc: "Guides from first prompt to production deploy.",
    href: "/guides",
    img: px("/refero/card-07.jpg"),
  },
  {
    title: "Video tutorials",
    desc: "Watch real builds, step by step.",
    href: "/community",
    img: px("/refero/card-08.jpg"),
  },
];

export default function SupportPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Support"
        title="How can we help?"
        sub="Docs, community and a team that actually replies."
        primary={{ label: "Ask the community", href: "/community" }}
      />
      <section className="mx-auto flex max-w-3xl justify-center px-4" aria-hidden="true">
        <FreebuffMark className="h-24 w-auto" />
      </section>
      <Section eyebrow="Start here" title="Explore resources">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {CARDS.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group overflow-hidden rounded-2xl border border-linen-border bg-warm-sand transition-colors hover:border-steel"
            >
              <img src={c.img} alt={c.title} loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" />
              <div className="p-5">
                <h3 className="font-medium text-charcoal group-hover:underline">{c.title}</h3>
                <p className="mt-1 text-sm text-steel">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
      <Section narrow eyebrow="FAQ" title="Frequently Asked Questions">
        <Faq
          items={[
            { q: "How do I restore an older version?", a: "Open version history on your project and restore any checkpoint in one click." },
            { q: "Why did my publish fail?", a: "Most failures are DNS or build errors — the chat will show the exact message and a fix." },
            { q: "How do I get a refund?", a: "Contact support within the billing window and we'll make it right." },
            { q: "Where do I report a bug?", a: "Use the in-app report flow or the community bug channel with steps to reproduce." },
          ]}
        />
      </Section>
      <CtaBand />
    </main>
  );
}
