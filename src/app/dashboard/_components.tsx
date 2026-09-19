import Link from "next/link";
import type { DemoProject } from "@/data/projects";

export function ProjectGrid({ projects, emptyNote }: { projects: DemoProject[]; emptyNote: string }) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-10 text-center">
        <p className="font-medium text-charcoal">Nothing here yet</p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-steel">{emptyNote}</p>
        <Link
          href="/new"
          className="mt-5 inline-block rounded-buttons bg-charcoal px-5 py-2.5 text-[15px] font-medium text-parchment transition-colors hover:bg-charcoal/90"
        >
          Start building
        </Link>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <Link
          key={p.id}
          href={`/projects/${p.id}`}
          className="group flex flex-col gap-3"
        >
          <span className={`relative block aspect-video overflow-hidden rounded-xl border border-black/10 bg-gradient-to-br ${p.hue}`}>
            <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-charcoal" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" />
              </svg>
            </span>
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="truncate text-sm text-charcoal group-hover:underline">{p.name}</span>
            <span className="text-xs text-smoke">{p.date}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

export function DashboardListHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-medium tracking-tight text-charcoal md:text-4xl">{title}</h1>
      <p className="mt-2 text-steel">{sub}</p>
    </div>
  );
}

export function DashboardListShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-8 md:py-14">{children}</div>
  );
}
