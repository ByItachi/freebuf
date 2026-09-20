"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Mic,
  MicOff,
  Plus,
  Search,
  Star,
  X,
} from "lucide-react";
import { recentProjectIds } from "@/lib/recents";
import { useUser } from "@/lib/use-user";
import { ProjectActionsMenu } from "@/components/app/project-actions-menu";
import { cn } from "@/lib/utils";

const tabs = [
  "My projects",
  "Recently viewed",
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

// Real connector platforms (same catalog as /dashboard/connectors).
// Duplicated in the pill marquee for a seamless hover scroll.
const PILL_ICONS = [
  { id: "github", src: "/connectors/github.svg", alt: "GitHub" },
  { id: "supabase", src: "/connectors/supabase.svg", alt: "Supabase" },
  { id: "stripe", src: "/connectors/stripe.svg", alt: "Stripe" },
  { id: "notion", src: "/connectors/notion.svg", alt: "Notion" },
  { id: "slack", src: "/connectors/slack.svg", alt: "Slack" },
  { id: "figma", src: "/connectors/figma.svg", alt: "Figma" },
];

function ConnectorIcons() {
  // Connected state lives in localStorage (set from /dashboard/connectors):
  // connected platforms are shown first in the strip.
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem("lovable.connectors");
        if (raw) setConnected(JSON.parse(raw) as Record<string, boolean>);
      } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, []);
  const icons = [...PILL_ICONS].sort(
    (a, b) => Number(Boolean(connected[b.id])) - Number(Boolean(connected[a.id])),
  );
  return (
    <span aria-hidden className="relative h-6 w-[60px] shrink-0 overflow-hidden rounded-full">
      <span className="dash-pill-marquee absolute inset-y-0 left-0 flex items-center">
        {[...icons, ...icons].map((ic, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- tiny decorative SVGs; keeps them out of the image optimizer
          <img
            key={`${ic.src}-${i}`}
            src={ic.src}
            alt=""
            width={24}
            height={24}
            className="mr-[-6px] shrink-0 rounded-full bg-parchment object-contain"
          />
        ))}
      </span>
    </span>
  );
}

function editedLabel(iso: string, now: number) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Edited recently";
  const mins = Math.max(1, Math.round((now - d.getTime()) / 60000));
  // Relative stamp for fresh edits (Lovable-style "2h ago"), date for older.
  if (mins < 60) return `Edited ${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `Edited ${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days <= 7) return `Edited ${days}d ago`;
  return `Edited ${d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const searchBtnRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const plusMenuRef = useRef<HTMLDivElement>(null);
  const modeMenuRef = useRef<HTMLDivElement>(null);
  // Left edge (pill-relative) where the expanded search input starts —
  // measured from the Search tab's right edge, like the reference UI.
  const [searchLeft, setSearchLeft] = useState(28);
  const [prompt, setPrompt] = useState("");
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [creating, setCreating] = useState(false);
  const [buildOpen, setBuildOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);
  const [mode, setMode] = useState<"build" | "plan">("build");
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [typedPh, setTypedPh] = useState(PLACEHOLDER_SUGGESTIONS[0]);
  const [now, setNow] = useState(() => Date.now());
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
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // Live "Edited Xh ago" stamps: re-render every 30s so relative labels
  // stay fresh while the page is open.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, []);

  // Sliding tab indicator: measure the active tab button and animate a pill
  // behind it (re-measure on resize and after fonts settle).
  useLayoutEffect(() => {
    const measure = () => {
      const sb = searchBtnRef.current;
      if (sb) setSearchLeft(sb.offsetLeft + sb.offsetWidth + 8);
      const el = tabRefs.current.get(activeTab);
      if (!el) {
        setIndicator((s) => ({ ...s, ready: false }));
        return;
      }
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
    };
    measure();
    const t = setTimeout(measure, 120);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [activeTab, searchOpen]);

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

  // Close composer popovers on outside click; Alt+P toggles Build/Plan.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (buildOpen && plusMenuRef.current && !plusMenuRef.current.contains(t)) {
        setBuildOpen(false);
      }
      if (modeOpen && modeMenuRef.current && !modeMenuRef.current.contains(t)) {
        setModeOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setBuildOpen(false);
        setModeOpen(false);
        return;
      }
      if (e.altKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setMode((m) => (m === "build" ? "plan" : "build"));
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [buildOpen, modeOpen]);

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

  function openSearch() {
    setSearchOpen(true);
    requestAnimationFrame(() => {
      const b = searchBtnRef.current;
      if (b) setSearchLeft(b.offsetLeft + b.offsetWidth + 8);
      searchInputRef.current?.focus();
    });
  }

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      return projects.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (activeTab === "Lovable templates") {
      return projects.filter((p) => p.published);
    }
    if (activeTab === "Recently viewed") {
      const rank = new Map(recentIds.map((id, i) => [id, i]));
      return projects
        .filter((p) => rank.has(p.id))
        .sort((a, b) => rank.get(a.id)! - rank.get(b.id)!);
    }
    return projects;
  }, [activeTab, projects, recentIds, query]);

  const emptyCopy: Record<Tab, { title: string; body: string }> = {
    "My projects": {
      title: "No projects yet",
      body: "Type an idea above — AI will create a project and open the builder.",
    },
    "Recently viewed": {
      title: "Nothing viewed yet",
      body: "Projects you open will appear here for quick access.",
    },
    "Lovable templates": {
      title: "No templates yet",
      body: "Publish a project to turn it into a reusable template, or browse the template gallery.",
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-parchment">
      {/* Full-page pastel aurora: blurred corner blobs behind everything */}
      <div aria-hidden className="dash-hero-aurora pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col items-center px-6 pb-16 pt-10 sm:px-8">
        <Link
          href="/dashboard/connectors"
          className="dash-connect-pill dash-anim-in inline-flex items-center gap-1 rounded-full border border-linen-border bg-parchment/75 px-3.5 py-1.5 text-[13px] tracking-tight text-charcoal shadow-[inset_0_0_0_0.5px_rgba(28,28,28,0.04)] backdrop-blur-md transition-transform hover:-translate-y-0.5"
        >
          <ConnectorIcons />
          Connect all your tools
          <ArrowRight className="size-3.5 text-dim-gray" />
        </Link>

        <h1 className="dash-anim-in dash-anim-in-delay-1 mb-10 mt-24 text-center text-[40px] font-medium leading-tight tracking-tight text-charcoal md:mt-44 sm:text-[44px]">
          {greeting}
        </h1>

        <form
          className="dash-anim-in dash-anim-in-delay-2 dash-prompt-shell w-full max-w-3xl rounded-[24px] bg-warm-sand p-3 shadow-[inset_0_0_0_0.5px_rgba(28,28,28,0.06),0_20px_40px_-28px_rgba(28,28,28,0.35)] sm:p-3.5"
          onSubmit={(e) => {
            e.preventDefault();
            void createFromPrompt();
          }}
        >
          <textarea
            rows={1}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void createFromPrompt();
              }
            }}
            placeholder={`${PLACEHOLDER_PREFIX}${typedPh}...`}
            className="min-h-[28px] w-full resize-none bg-transparent px-2 py-1.5 text-[15px] leading-snug tracking-tight text-charcoal outline-none placeholder:text-dim-gray"
          />
          <div className="mt-0.5 flex items-end justify-between gap-2">
            <div ref={plusMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setBuildOpen((v) => !v)}
                aria-expanded={buildOpen}
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-black/[0.05]"
                aria-label="Attach or create"
              >
                <Plus className="size-5" />
              </button>
              {buildOpen ? (
                <div
                  role="menu"
                  className="dash-menu-pop absolute bottom-full left-0 z-50 mb-2 w-56 rounded-2xl border border-linen-border bg-parchment p-1.5 shadow-[0_16px_40px_-16px_rgba(28,28,28,0.35)]"
                >
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
            </div>
            <div className="mb-0.5 flex shrink-0 items-center gap-1.5">
              <div ref={modeMenuRef} className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setModeOpen((v) => !v)}
                  aria-expanded={modeOpen}
                  aria-haspopup="menu"
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[13px] font-medium text-charcoal transition-colors hover:bg-black/[0.05]"
                >
                  {mode === "build" ? "Build" : "Plan"}
                  <ChevronDown className="size-3.5 text-dim-gray" />
                </button>
                {modeOpen ? (
                  <div
                    role="menu"
                    aria-orientation="vertical"
                    className="dash-menu-pop absolute top-full right-0 z-50 mt-2 min-w-48 rounded-2xl border border-linen-border bg-parchment p-1 shadow-[0_16px_40px_-16px_rgba(28,28,28,0.35)]"
                  >
                    <div role="group">
                      {(
                        [
                          { value: "build" as const, title: "Build", desc: "Make changes directly" },
                          { value: "plan" as const, title: "Plan", desc: "Detailed spec for complex builds" },
                        ]
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          role="menuitemradio"
                          aria-checked={mode === opt.value}
                          onClick={() => {
                            setMode(opt.value);
                            setModeOpen(false);
                          }}
                          className="flex w-full cursor-pointer items-start justify-start gap-x-1 rounded-xl px-2 py-2 pe-8 text-left text-[13px] tracking-tight text-charcoal transition-colors hover:bg-black/[0.04]"
                        >
                          <span>
                            <span className="block">{opt.title}</span>
                            <span className="block text-[12px] text-dim-gray">{opt.desc}</span>
                          </span>
                          {mode === opt.value ? (
                            <Check className="absolute right-2 top-2 size-4 text-dim-gray" />
                          ) : null}
                        </button>
                      ))}
                    </div>
                    <div className="mx-1 my-1 hidden h-px bg-linen-border sm:block" />
                    <p className="hidden items-center gap-1 px-2 py-0.5 text-[12px] text-dim-gray sm:flex">
                      Switch modes with
                      <span className="inline-flex items-center gap-0.5">
                        <kbd className="rounded border border-linen-border bg-warm-sand px-1 py-0.5 text-[10px] text-dim-gray">Alt</kbd>
                        <kbd className="rounded border border-linen-border bg-warm-sand px-1 py-0.5 text-[10px] text-dim-gray">P</kbd>
                      </span>
                    </p>
                  </div>
                ) : null}
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
            </div>
          </div>
          {listening ? (
            <p className="mt-2 px-1 text-[12px] text-dim-gray">Listening… speak now</p>
          ) : null}
        </form>

        <section className="dash-anim-in dash-anim-in-delay-3 mt-28 w-full rounded-[28px] border border-linen-border bg-parchment/90 p-4 shadow-[inset_0_0_0_0.5px_rgba(28,28,28,0.03)] backdrop-blur-sm sm:p-6">
          {/* Tab bar — Search pill expands into an input, sliding indicator */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex min-w-0 items-center rounded-full bg-black/[0.04] shadow-[inset_0_0_0_0.5px_rgba(28,28,28,0.03)]">
              <div className="relative inline-flex max-w-full items-center overflow-x-auto rounded-full p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button
                  ref={searchBtnRef}
                  type="button"
                  onClick={openSearch}
                  aria-expanded={searchOpen}
                  className={
                    "relative z-10 inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13px] tracking-tight transition-colors " +
                    (searchOpen ? "text-charcoal" : "text-dim-gray hover:text-charcoal")
                  }
                >
                  <Search className="size-4" />
                  Search
                </button>
                {tabs.map((tab) => {
                  const active = !searchOpen && tab === activeTab;
                  return (
                    <button
                      key={tab}
                      ref={(el) => {
                        if (el) tabRefs.current.set(tab, el);
                        else tabRefs.current.delete(tab);
                      }}
                      type="button"
                      onClick={() => {
                        closeSearch();
                        setActiveTab(tab);
                      }}
                      aria-selected={active}
                      role="tab"
                      className={
                        "relative z-10 inline-flex h-8 shrink-0 items-center whitespace-nowrap rounded-full px-3 text-[13px] tracking-tight transition-[color,opacity] duration-300 ease-out " +
                        (active ? "font-medium text-charcoal " : "text-dim-gray hover:text-charcoal ") +
                        (searchOpen ? "pointer-events-none opacity-0" : "")
                      }
                    >
                      {tab}
                    </button>
                  );
                })}
                {!searchOpen ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-1 rounded-full bg-parchment shadow-[0_1px_2px_rgba(28,28,28,0.08)] transition-[left,width] duration-300 ease-out"
                    style={{
                      left: indicator.left,
                      width: indicator.width,
                      opacity: indicator.ready ? 1 : 0,
                    }}
                  />
                ) : null}
              </div>
              {searchOpen ? (
                <div
                  className="absolute inset-y-0 right-1 z-20 flex items-center gap-1 pl-2"
                  style={{ left: searchLeft }}
                >
                  <input
                    ref={searchInputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") closeSearch();
                    }}
                    aria-label="Search projects"
                    autoComplete="off"
                    placeholder="Search your projects…"
                    className="h-8 min-w-0 flex-1 bg-transparent text-sm text-charcoal outline-none placeholder:text-dim-gray"
                  />
                  <button
                    type="button"
                    onClick={closeSearch}
                    aria-label="Close search"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-black/[0.06]"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : null}
            </div>
            <Link
              href="/dashboard/projects"
              className="hidden items-center gap-1 rounded-full px-2.5 py-1.5 text-[13px] font-medium text-charcoal transition-opacity hover:opacity-80 md:inline-flex"
            >
              Browse all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-warm-sand/60 px-6 py-16 text-center">
              <p className="text-[15px] font-medium tracking-tight text-charcoal">{emptyCopy[activeTab].title}</p>
              <p className="mx-auto mt-1.5 max-w-sm text-[13px] leading-relaxed text-dim-gray">{emptyCopy[activeTab].body}</p>
              {activeTab === "Lovable templates" ? (
                <Link
                  href="/templates"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-charcoal px-4 py-2 text-[13px] font-medium text-parchment transition-colors hover:bg-charcoal/90"
                >
                  Browse templates
                  <ArrowRight className="size-3.5" />
                </Link>
              ) : null}
              {activeTab === "Recently viewed" ? (
                <p className="mt-4 text-[12px] text-dim-gray/70">Tip: use Search to jump straight to any project.</p>
              ) : null}
            </div>
          ) : (
            <div className="relative grid w-full grid-cols-1 gap-x-4 gap-y-5 min-[700px]:gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="group/card relative -m-2 flex flex-col gap-2 rounded-2xl p-2 transition-colors hover:bg-black/[0.03]"
                >
                  <Link
                    href={`/projects/${p.id}`}
                    aria-label={p.name}
                    className="absolute inset-0 z-[1] rounded-xl"
                  />
                  <div className="pointer-events-none relative z-[2]">
                    <div className="relative w-full overflow-hidden rounded-xl bg-warm-sand">
                      <div className="relative aspect-video w-full">
                        {p.cover ? (
                          <Image
                            src={p.cover}
                            alt=""
                            fill
                            priority={p === filtered[0]}
                            sizes="(min-width:1024px) 448px, (min-width:640px) 50vw, 100vw"
                            className="object-cover object-top"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#82bcff] via-[#ff66f4] to-[#fe7b02]" />
                        )}
                      </div>
                      {p.published ? (
                        <span className="absolute left-2 top-2 rounded-md bg-parchment/90 px-1.5 py-0.5 text-[10.5px] font-medium text-charcoal backdrop-blur-sm">
                          Published
                        </span>
                      ) : null}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleStarById(p.id, !p.starred);
                        }}
                        aria-label={p.starred ? `Unstar ${p.name}` : `Add to favorites`}
                        className="pointer-events-auto absolute right-2 top-2 z-[5] flex size-7 items-center justify-center rounded-lg bg-parchment/80 backdrop-blur-xs transition-all duration-150 hover:bg-parchment md:pointer-events-none md:opacity-0 md:group-hover/card:pointer-events-auto md:group-hover/card:opacity-100 md:group-has-[:focus-visible]/card:pointer-events-auto md:group-has-[:focus-visible]/card:opacity-100"
                      >
                        <Star
                          className={cn(
                            "size-4",
                            p.starred
                              ? "fill-amber-400 text-amber-400 opacity-100"
                              : "text-charcoal/60 opacity-0 md:group-hover/card:opacity-100",
                          )}
                        />
                      </button>
                    </div>
                    <div className="flex w-full min-w-0 items-center gap-2 p-1 pt-2">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#82bcff] via-[#ff66f4] to-[#fe7b02] text-[11px] font-medium text-parchment shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12)]">
                        {initials || "RD"}
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="min-w-0 truncate text-[14px] font-medium tracking-tight text-charcoal">
                          {p.name}
                        </span>
                        <span className="min-w-0 truncate text-[12px] text-dim-gray">
                          {editedLabel(p.updatedAt, now)}
                        </span>
                      </div>
                      <span className="pointer-events-auto relative z-20 flex shrink-0 items-center md:pointer-events-none md:opacity-0 md:transition-opacity md:group-hover/card:pointer-events-auto md:group-hover/card:opacity-100 md:group-has-[:focus-visible]/card:pointer-events-auto md:group-has-[:focus-visible]/card:opacity-100">
                        <ProjectActionsMenu project={p} onChanged={refresh} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {/* Invite card always fills the slot after the last project. */}
              {(
                <Link
                  href="/new"
                  aria-label="Create a new project"
                  className="group/invite -m-2 flex flex-col gap-2 rounded-2xl p-2 transition-colors hover:bg-black/[0.03]"
                >
                  <div className="dash-invite-frame aspect-video w-full overflow-hidden rounded-xl p-[1.5px]">
                    <div className="relative flex h-full w-full items-center justify-center rounded-[10.5px] border border-dashed border-stone bg-warm-sand/80">
                      <Plus className="size-6 text-dim-gray" />
                    </div>
                  </div>
                  <div className="p-1 pt-2">
                    <span className="block text-[14px] font-medium tracking-tight text-charcoal">New project</span>
                    <span className="block text-[12px] text-dim-gray">Start from a blank canvas</span>
                  </div>
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
