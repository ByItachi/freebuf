"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { ProjectActionsMenu } from "@/components/app/project-actions-menu";

type Project = {
  id: string;
  name: string;
  updatedAt: string;
  starred: boolean;
  published: boolean;
  cover?: string;
  createdByMe?: boolean;
  shared?: boolean;
};

function timeAgo(iso: string) {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.max(1, Math.round(d / 60000));
  if (m < 60) return `Edited ${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `Edited ${h}h ago`;
  return `Edited ${Math.round(h / 24)}d ago`;
}

export default function ProjectsFilterPage({
  title,
  subtitle,
  filter,
}: {
  title: string;
  subtitle: string;
  filter: (p: Project) => boolean;
}) {
  const [projects, setProjects] = useState<Project[]>([]);

  const load = useCallback(() => {
    fetch("/api/projects", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setProjects((d.projects ?? []).filter(filter)))
      .catch(() => setProjects([]));
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-10 tracking-tight sm:px-8">
      <h1 className="text-[32px] font-medium text-charcoal">{title}</h1>
      <p className="mt-2 text-[15px] text-dim-gray">{subtitle}</p>
      {projects.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-linen-border bg-warm-sand px-6 py-12 text-center">
          <p className="text-[14px] text-dim-gray">Nothing here yet. Create a project from Home.</p>
          <Link href="/dashboard" className="mt-4 inline-block text-[13px] text-charcoal underline">
            Go to Home
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 min-[700px]:gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(auto-fill,minmax(min(345px,calc((100%-48px)/3)),1fr))]">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="group overflow-hidden rounded-2xl bg-warm-sand"
            >
              <div className="relative min-h-[100px] overflow-hidden">
                {p.cover ? (
                  <Image src={p.cover} alt={p.name} fill className="object-cover object-top" sizes="(min-width:1024px) 448px, (min-width:640px) 50vw, 100vw" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#82bcff] via-[#ff66f4] to-[#fe7b02]" />
                )}
                {p.starred ? (
                  <Star className="absolute right-2.5 top-2.5 size-4 fill-amber-400 text-amber-400" />
                ) : null}
              </div>
              <div className="flex items-center gap-1 px-3 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium text-charcoal group-hover:underline">{p.name}</span>
                  <span className="block text-[12px] text-dim-gray">{timeAgo(p.updatedAt)}</span>
                </span>
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <ProjectActionsMenu project={p} onChanged={load} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}