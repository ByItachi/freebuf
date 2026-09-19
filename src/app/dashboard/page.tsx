"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUp,
  ChevronDown,
  Loader2,
  Mic,
  MicOff,
  Plus,
  Star,
} from "lucide-react";
import {
  recentProjectIds,
  visitedTodayIds,
} from "@/lib/recents";
import { useUser } from "@/lib/use-user";
import { ProjectActionsMenu } from "@/components/app/project-actions-menu";
import { cn } from "@/lib/utils";

const tabs = [
  "My projects",
  "Recently viewed",
  "Starred",
  "Most visited today",
  "Lovable templates",
] as const;
type Tab = (typeof tabs)[number];

const PLACEHOLDER_PREFIX = "Ask Lovable to build ";
const PLACEHOLDER_SUGGESTIONS: string[] = [
  "a web app that",
  "generate report on",
  "create a dashboard to",
  "analyze my data",
];

type ProjectCard = {
  id: string;
  name: string;
  updatedAt: string;
  starred: boolean;
  published: boolean;
  cover?: string;
};

function ToolLogos() {
  const colors = ["#2483ff", "#ff66f4", "#fe7b02", "#22c55e", "#a855f7"];
  return (
    <span className="ml-1.5 flex -space-x-1.5">
      {colors.map((c) => (
        <span
          key={c}
          className="inline-block size-3.5 rounded-full border border-parchment/80"
          style={{ background: c }}
        />
      ))}
    </span>
  );
}

function timeAgo(iso: string) {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.max(1, Math.round(d / 60000));
  if (m < 60) return `Edited ${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `Edited ${h}h ago`;
  return `Edited ${Math.round(h / 24)}d ago`;
}

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

export default function DashboardHomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("My projects");
  const [prompt, setPrompt] = useState("");
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [creating, setCreating] = useState(false);
  const [buildOpen, setBuildOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [todayIds, setTodayIds] = useState<string[]>([]);
  const [typedPh, setTypedPh] = useState(PLACEHOLDER_SUGGESTIONS[0]);
  const { user, initials } = useUser();

  const firstName = useMemo(() => {
    const n = user?.name?.trim();
    if (!n) return "";
    return n.split(/\s+/)[0];
  }, [user]);

  const greeting = firstName ? `Got an idea, ${firstName}?` : "Got an idea?";

  async function refresh() {
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      const data = await res.json();
      setProjects(data.projects ?? []);
    } catch {
      setProjects([]);
    }
  }

  useEffect(() => {
    let alive = true;
    fetch("/api/projects", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (alive) setProjects(d.projects ?? []);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // localStorage-backed tab data (client only; deferred like /new)
  useEffect(() => {
    const t = setTimeout(() => {
      setRecentIds(recentProjectIds());
      setTodayIds(visitedTodayIds());
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const w = window as unknown as {
        SpeechRecognition?: new () => SpeechRecognitionLike;
        webkitSpeechRecognition?: new () => SpeechRecognitionLike;
      };
      setVoiceSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // Typewriter placeholder: "Ask Lovable to build" stays fixed, the suffix
  // types out, pauses, deletes, and cycles through the suggestions.
  useEffect(() => {
    if (prompt.trim()) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    let w = 0;
    let c = PLACEHOLDER_SUGGESTIONS[0].length;
    let deleting = false;
    let hold = 0;
    const id = window.setInterval(() => {
      const full = PLACEHOLDER_SUGGESTIONS[w % PLACEHOLDER_SUGGESTIONS.length];
      if (!deleting) {
        c += 1;
        setTypedPh(full.slice(0, c));
        if (c >= full.length) {
          deleting = true;
          hold = 0;
        }
      } else {
        if (hold < 20) {
          hold += 1;
          return;
        }
        c -= 2;
        if (c <= 0) {
          c = 0;
          deleting = false;
          w += 1;
        }
        setTypedPh(PLACEHOLDER_SUGGESTIONS[w % PLACEHOLDER_SUGGESTIONS.length].slice(0, Math.max(0, c)));
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [prompt]);

  const toggleVoice = useCallback(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    if (listening) {
      setListening(false);
      return;
    }
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e) => {
      const transcript = Array.from({ length: e.results.length }, (_, i) =>
        e.results[i][0].transcript,
      ).join(" ");
      setPrompt((p) => (p ? `${p} ${transcript}` : transcript));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
  }, [listening]);

  async function createFromPrompt() {
    const text = prompt.trim();
    if (!text || creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "create failed");
      router.push(`/projects/${data.project.id}`);
    } catch (e) {
      console.error(e);
      setCreating(false);
    }
  }

  async function createBlank() {
    if (creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "Blank project", name: "Untitled project" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "create failed");
      router.push(`/projects/${data.project.id}`);
    } catch (e) {
      console.error(e);
      setCreating(false);
    }
  }

  function toggleStarById(id: string, starred: boolean) {
    void fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ starred }),
    }).then(() => refresh());
  }

  const filtered = useMemo(() => {
    if (activeTab === "Starred") return projects.filter((p) => p.starred);
    if (activeTab === "Lovable templates") {
      return projects.filter((p) => p.published);
    }
    if (activeTab === "Recently viewed") {
      const rank = new Map(recentIds.map((id, i) => [id, i]));
      return projects
        .filter((p) => rank.has(p.id))
        .sort((a, b) => rank.get(a.id)! - rank.get(b.id)!);
    }
    if (activeTab === "Most visited today") {
      const rank = new Map(todayIds.map((id, i) => [id, i]));
      return projects
        .filter((p) => rank.has(p.id))
        .sort((a, b) => rank.get(a.id)! - rank.get(b.id)!);
    }
    return projects;
  }, [activeTab, projects, recentIds, todayIds]);

  const emptyCopy: Record<Tab, { title: string; body: string }> = {
    "My projects": {
      title: "No projects yet",
      body: "Type an idea above — AI will create a project and open the builder.",
    },
    "Recently viewed": {
      title: "Nothing viewed yet",
      body: "Projects you open will appear here for quick access.",
    },
    Starred: {
      title: "Nothing starred yet",
      body: "Star a project to pin it here.",
    },
    "Most visited today": {
      title: "No visits today",
      body: "Projects you open today will be ranked here by visits.",
    },
    "Lovable templates": {
      title: "No templates yet",
      body: "Publish a project to turn it into a reusable template, or browse the template gallery.",
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-parchment">
      <div aria-hidden className="dash-hero-aurora pointer-events-none absolute inset-x-0 top-0 h-[440px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[260px] h-48 bg-gradient-to-b from-transparent to-parchment"
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-16 pt-14">
        <Link
          href="/dashboard/connectors"
          className="dash-connect-pill dash-anim-in mb-8 inline-flex items-center gap-1 rounded-full border border-linen-border bg-parchment/75 px-3.5 py-1.5 text-[13px] tracking-tight text-charcoal shadow-[inset_0_0_0_0.5px_rgba(28,28,28,0.04)] backdrop-blur-md transition-transform hover:-translate-y-0.5"
        >
          Connect all your tools
          <ArrowRight className="size-3.5 text-dim-gray" />
          <ToolLogos />
        </Link>

        <h1 className="dash-anim-in dash-anim-in-delay-1 mb-8 text-center text-[40px] font-medium leading-tight tracking-tight text-charcoal sm:text-[44px]">
          {greeting}
        </h1>

        <form
          className="dash-anim-in dash-anim-in-delay-2 dash-prompt-shell w-full max-w-2xl rounded-[28px] bg-warm-sand p-4 shadow-[inset_0_0_0_0.5px_rgba(28,28,28,0.08),0_20px_40px_-28px_rgba(28,28,28,0.35)] sm:p-5"
          onSubmit={(e) => {
            e.preventDefault();
            void createFromPrompt();
          }}
        >
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => setBuildOpen((v) => !v)}
              aria-expanded={buildOpen}
              className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-black/[0.05]"
              aria-label="Attach or create"
            >
              <Plus className="size-5" />
            </button>
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void createFromPrompt();
                }
              }}
              placeholder={`${PLACEHOLDER_PREFIX}${typedPh}...`}
              className="min-h-[52px] flex-1 resize-none bg-transparent px-1 py-2 text-[15px] leading-relaxed tracking-tight text-charcoal outline-none placeholder:text-dim-gray"
            />
            <div className="mb-0.5 flex shrink-0 items-center gap-1.5">
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setBuildOpen((v) => !v)}
                  aria-expanded={buildOpen}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[13px] font-medium text-charcoal transition-colors hover:bg-black/[0.05]"
                >
                  Build
                  <ChevronDown className="size-3.5 text-dim-gray" />
                </button>
              </div>
              {voiceSupported ? (
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`flex size-9 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-black/[0.05] ${
                    listening ? "bg-black/[0.08]" : ""
                  }`}
                  aria-label={listening ? "Stop voice input" : "Start voice input"}
                  aria-pressed={listening}
                >
                  {listening ? <MicOff className="size-[18px]" /> : <Mic className="size-[18px]" />}
                </button>
              ) : null}
              <button
                type="submit"
                disabled={creating || !prompt.trim()}
                className="dash-send-btn flex size-9 items-center justify-center rounded-full text-parchment shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.25)] disabled:opacity-50"
                aria-label="Send"
              >
                {creating ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
              </button>
            </div>
          </div>

          {buildOpen ? (
            <div className="mt-3 rounded-2xl border border-linen-border bg-parchment p-2 text-[13px]">
              <button
                type="button"
                onClick={() => {
                  setBuildOpen(false);
                  void createBlank();
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-charcoal transition-colors hover:bg-black/[0.04]"
              >
                <span>
                  <span className="block font-medium">Blank project</span>
                  <span className="text-[12px] text-dim-gray">Start from an empty canvas</span>
                </span>
                <ArrowRight className="size-3.5 text-dim-gray" />
              </button>
              <Link
                href="/templates"
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-charcoal transition-colors hover:bg-black/[0.04]"
              >
                <span>
                  <span className="block font-medium">From template</span>
                  <span className="text-[12px] text-dim-gray">Start from a production-ready layout</span>
                </span>
                <ArrowRight className="size-3.5 text-dim-gray" />
              </Link>
              <Link
                href="/dashboard/connectors"
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-charcoal transition-colors hover:bg-black/[0.04]"
              >
                <span>
                  <span className="block font-medium">Import from tool</span>
                  <span className="text-[12px] text-dim-gray">Connect GitHub, Supabase, Stripe…</span>
                </span>
                <ArrowRight className="size-3.5 text-dim-gray" />
              </Link>
            </div>
          ) : null}
          {listening ? (
            <p className="mt-2 px-1 text-[12px] text-dim-gray">Listening… speak now</p>
          ) : null}
        </form>

        <section className="dash-anim-in dash-anim-in-delay-3 mt-12 w-full rounded-[28px] border border-linen-border bg-parchment/90 p-4 shadow-[inset_0_0_0_0.5px_rgba(28,28,28,0.03)] backdrop-blur-sm sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1 rounded-full bg-black/[0.04] p-1">
              {tabs.map((tab) => {
                const active = tab === activeTab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={
                      "dash-tab rounded-full px-3.5 py-1.5 text-[13px] tracking-tight transition-all " +
                      (active
                        ? "bg-parchment font-medium text-charcoal shadow-[0_1px_2px_rgba(28,28,28,0.06)]"
                        : "text-dim-gray hover:text-charcoal")
                    }
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
            <Link
              href="/dashboard/projects"
              className="inline-flex items-center gap-1 rounded-full border border-linen-border px-3 py-1.5 text-[13px] text-charcoal transition-all hover:-translate-y-0.5 hover:bg-warm-sand"
            >
              Browse all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-linen-border bg-warm-sand/60 px-6 py-14 text-center">
              <p className="text-[15px] font-medium text-charcoal">{emptyCopy[activeTab].title}</p>
              <p className="mt-1 text-[13px] text-dim-gray">{emptyCopy[activeTab].body}</p>
              {activeTab === "Lovable templates" ? (
                <Link
                  href="/templates"
                  className="mt-4 inline-block rounded-full bg-black px-4 py-2 text-[13px] font-semibold text-white"
                >
                  Browse templates
                </Link>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="dash-card group block overflow-hidden rounded-2xl border border-linen-border bg-warm-sand"
                >
                    <div className="relative aspect-[16/10] overflow-hidden bg-warm-sand">
                      {p.cover ? (
                        <Image
                          src={p.cover}
                          alt={p.name}
                          fill
                          sizes="(min-width:1024px) 320px, (min-width:640px) 45vw, 100vw"
                          className="dash-card-thumb object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#82bcff] via-[#ff66f4] to-[#fe7b02]" />
                      )}
                      {p.published ? (
                        <span className="absolute left-2.5 top-2.5 rounded-full bg-parchment/90 px-2 py-0.5 text-[11px] font-medium text-charcoal backdrop-blur-sm">
                          Published
                        </span>
                      ) : null}
                      {p.starred ? (
                        <Star className="absolute right-2.5 top-2.5 size-4 fill-amber-400 text-amber-400 drop-shadow" />
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#82bcff] to-[#fe7b02] text-[10px] font-medium text-parchment">
                        {initials || "RD"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-medium tracking-tight text-charcoal group-hover:underline">
                          {p.name}
                        </p>
                        <p className="truncate text-[12px] text-dim-gray">{timeAgo(p.updatedAt)}</p>
                      </div>
                      {activeTab !== "Starred" ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleStarById(p.id, !p.starred);
                          }}
                          aria-label={p.starred ? `Unstar ${p.name}` : `Star ${p.name}`}
                          className="flex size-7 shrink-0 items-center justify-center rounded-full text-dim-gray transition-colors hover:bg-black/[0.05] hover:text-charcoal"
                        >
                          <Star
                            className={cn("size-4", p.starred && "fill-amber-400 text-amber-400")}
                          />
                        </button>
                      ) : null}
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <ProjectActionsMenu project={p} onChanged={refresh} />
                      </span>
                    </div>
                  </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
