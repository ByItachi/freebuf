import Link from "next/link";
import { InnerHero, Section } from "@/components/site/inner";
import { POSTS } from "@/data/posts";
import { GUIDES } from "@/data/guides";

const GROUPS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "Pricing", href: "/pricing" },
      { label: "Templates", href: "/templates" },
      { label: "Solutions", href: "/solutions" },
      { label: "For work", href: "/for-work" },
      { label: "Enterprise", href: "/enterprise" },
      { label: "Cloud", href: "/cloud" },
      { label: "Download", href: "/download" },
      { label: "New project", href: "/new" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Who it's for",
    links: [
      { label: "Founders", href: "/founders" },
      { label: "Designers", href: "/designers" },
      { label: "Marketers", href: "/marketers" },
      { label: "Product managers", href: "/product-managers" },
      { label: "Sales", href: "/sales" },
      { label: "Students", href: "/students" },
      { label: "Healthcare", href: "/healthcare" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Customers", href: "/customers" },
      { label: "Reviews", href: "/reviews" },
      { label: "Careers", href: "/careers" },
      { label: "Community", href: "/community" },
      { label: "Brand", href: "/brand" },
      { label: "Security", href: "/security" },
      { label: "Support", href: "/support" },
      { label: "Compare: Bolt", href: "/bolt-vs-freebuff" },
    ],
  },
  {
    title: "Partners",
    links: [
      { label: "Solution partners", href: "/partners/solution" },
      { label: "Affiliates", href: "/partners/affiliates" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Cookies", href: "/cookie-policy" },
      { label: "DMCA", href: "/dmca" },
      { label: "Platform rules", href: "/platform-rules" },
      { label: "Security issues", href: "/security-issues" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
  {
    title: "Developers",
    links: [{ label: "MCP server", href: "/mcp" }],
  },
];

export default function SitemapPage() {
  return (
    <main className="bg-parchment">
      <InnerHero eyebrow="Index" title="Sitemap" sub="Every page on this site, in one place." />
      {GROUPS.map((g) => (
        <Section key={g.title} eyebrow={g.title} title={g.title}>
          <div className="flex flex-wrap gap-2">
            {g.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm text-steel transition-colors hover:border-stone hover:text-charcoal"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </Section>
      ))}
      <Section eyebrow="Blog" title="Latest posts">
        <div className="flex flex-wrap gap-2">
          {POSTS.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm text-steel transition-colors hover:border-stone hover:text-charcoal"
            >
              {p.title}
            </Link>
          ))}
        </div>
      </Section>
      <Section eyebrow="Guides" title="Guides">
        <div className="flex flex-wrap gap-2">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm text-steel transition-colors hover:border-stone hover:text-charcoal"
            >
              {g.title}
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
