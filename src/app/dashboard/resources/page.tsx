"use client";

import Link from "next/link";

const LINKS = [
  { href: "/guides", title: "Guides", desc: "Step-by-step build tutorials" },
  { href: "/templates", title: "Templates", desc: "Start from production-ready layouts" },
  { href: "/support", title: "Support", desc: "Get help, report issues, contact us" },
  { href: "/community", title: "Community", desc: "Examples from other builders" },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 tracking-tight">
      <h1 className="text-[32px] font-medium text-charcoal">Resources</h1>
      <p className="mt-2 text-[15px] text-dim-gray">Guides, docs, and learning resources.</p>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-2xl border border-linen-border bg-warm-sand px-4 py-4 transition-colors hover:bg-parchment"
          >
            <p className="text-[15px] font-medium text-charcoal">{l.title}</p>
            <p className="text-[13px] text-dim-gray">{l.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}