"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { px } from "@/lib/img";
import {
  AdidasLogo,
  AsanaLogo,
  ElevenLabsLogo,
  ZendeskLogo,
  WorkdayLogo,
  NvidiaLogo,
} from "@/components/brand-logos";

/**
 * Scroll-reveal wrapper: fades + rises content once when it enters the
 * viewport. Class-based so SSR content stays visible without JS.
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    el.classList.add("scroll-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Prompt composer — 1:1 with the live freebuff.dev hero markup:
 * 28px-radius warm-sand card, white border + black/8 ring, min-40px input,
 * real +/Build/mic icons; the gradient send button appears only with text.
 */
const BUILD_MODE_KEY = "lov-build-mode";

type BuildMode = "agent" | "chat";

const TYPEWRITER_SUGGESTIONS = [
  "Build a full-stack app from one prompt...",
  "Ship a SaaS dashboard in minutes...",
  "Create a portfolio that lands clients...",
  "Prototype an AI agent workspace...",
];

/**
 * Build-mode dropdown menu — 1:1 with the live site: white panel with the
 * blue-tinted pill switcher (Agent/Chat) on the --lov-* tokens, then the
 * action rows with thin icons. Selection persists in localStorage.
 */
function BuildModeMenu({
  mode,
  onPick,
}: {
  mode: BuildMode;
  onPick: (m: BuildMode) => void;
}) {
  const items: Array<{
    id: BuildMode;
    label: string;
    desc: string;
    icon: React.ReactNode;
  }> = [
    {
      id: "agent",
      label: "Agent",
      desc: "Plans, writes, and runs your app end to end",
      icon: (
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
          <path
            d="M12 2l1.2 4.6a2 2 0 0 0 1.4 1.4L19.2 9.2l-4.6 1.2a2 2 0 0 0-1.4 1.4L12 16.4l-1.2-4.6a2 2 0 0 0-1.4-1.4L4.8 9.2l4.6-1.2a2 2 0 0 0 1.4-1.4L12 2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "chat",
      label: "Chat",
      desc: "Ask questions and iterate with quick edits",
      icon: (
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  const activeIdx = mode === "agent" ? 0 : 1;

  return (
    <div
      className="menu-pop absolute bottom-full left-0 z-30 mb-2 w-[320px] rounded-2xl border border-linen-border bg-white p-2 shadow-subtle-2"
      role="menu"
    >
      <div className="lov-switcher-track mx-auto w-full">
        <span
          className="lov-switcher-pill"
          style={{ transform: `translateX(${activeIdx * 100}%)` }}
          aria-hidden="true"
        />
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            role="tab"
            aria-selected={mode === it.id}
            onClick={() => onPick(it.id)}
            className={`relative z-10 flex-1 rounded-full px-3 py-1.5 text-[14px] transition-colors ${
              mode === it.id ? "font-w480 text-charcoal" : "text-dim-gray hover:text-charcoal"
            }`}
          >
            {it.label}
          </button>
        ))}
      </div>
      <div className="mt-2">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            role="menuitem"
            onClick={() => onPick(it.id)}
            className={`flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-colors ${
              mode === it.id ? "bg-warm-sand" : "hover:bg-warm-sand/60"
            }`}
          >
            <span className="mt-0.5 text-charcoal">{it.icon}</span>
            <span>
              <span className="block text-[14px] font-w480 text-charcoal">{it.label}</span>
              <span className="block text-[13px] leading-snug text-dim-gray">{it.desc}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function PromptComposer() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<BuildMode>("agent");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasText = prompt.trim().length > 0;

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const saved = localStorage.getItem(BUILD_MODE_KEY);
        if (saved === "chat" || saved === "agent") setMode(saved);
      } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const pickMode = useCallback((m: BuildMode) => {
    setMode(m);
    setMenuOpen(false);
    try {
      localStorage.setItem(BUILD_MODE_KEY, m);
    } catch {}
  }, []);

  /* Typewriter placeholder (live hook-typewriter): cycles suggestions while empty. */
  const [typedPh, setTypedPh] = useState(TYPEWRITER_SUGGESTIONS[0]);
  useEffect(() => {
    if (hasText) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let w = 0;
    let c = TYPEWRITER_SUGGESTIONS[0].length;
    let deleting = true;
    let hold = 0;
    const id = window.setInterval(() => {
      const full = TYPEWRITER_SUGGESTIONS[w % TYPEWRITER_SUGGESTIONS.length];
      if (!deleting) {
        c += 1;
        setTypedPh(full.slice(0, c));
        if (c >= full.length) deleting = true;
      } else {
        if (hold < 22) {
          hold += 1;
          return;
        }
        c -= 3;
        if (c <= 0) {
          c = 0;
          deleting = false;
          w += 1;
          hold = 0;
        }
        setTypedPh(TYPEWRITER_SUGGESTIONS[w % TYPEWRITER_SUGGESTIONS.length].slice(0, c));
      }
    }, 45);
    return () => window.clearInterval(id);
  }, [hasText]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = prompt.trim();
    router.push(q ? `/new?q=${encodeURIComponent(q)}` : "/new");
  };

  return (
    <form
      data-testid="chat-composer"
      onSubmit={submit}
      className="relative z-10 w-full rounded-[28px] border border-linen-border bg-warm-sand p-3 shadow-xl ring-1 ring-white/5 transition-[background-color,border-color,box-shadow] duration-300 ease-out hover:border-stone focus-within:border-[#22C55E]/40 focus-within:shadow-[0_0_0_1px_rgba(34,197,94,0.25),0_0_40px_-12px_rgba(34,197,94,0.35)]"
    >
      <textarea
        rows={1}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={hasText ? "" : typedPh}
        aria-label="Chat input"
        className="max-h-[5rem] min-h-[40px] w-full resize-none overflow-y-auto bg-transparent px-2 pb-1 pt-2 font-mono-code text-[15px] leading-snug text-charcoal outline-none placeholder:text-smoke/70"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            (e.target as HTMLTextAreaElement).form?.requestSubmit();
          }
        }}
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Additional actions"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-charcoal transition-colors hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M11.25 20V12.75H4C3.58579 12.75 3.25 12.4142 3.25 12C3.25 11.5858 3.58579 11.25 4 11.25H11.25V4C11.25 3.58579 11.5858 3.25 12 3.25C12.4142 3.25 12.75 3.58579 12.75 4V11.25H20C20.4142 11.25 20.75 11.5858 20.75 12C20.75 12.4142 20.4142 12.75 20 12.75H12.75V20C12.75 20.4142 12.4142 20.75 12 20.75C11.5858 20.75 11.25 20.4142 11.25 20Z" />
          </svg>
        </button>
        <div className="ml-auto flex items-center gap-2">
          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              data-testid="create-form-chat-mode"
              onClick={() => setMenuOpen((v) => !v)}
              className={`flex h-8 items-center gap-0.5 rounded-full text-sm transition-colors ${
                menuOpen ? "bg-white/5 text-charcoal" : "text-charcoal hover:bg-white/5"
              }`}
            >
              <span className="px-0.5">{mode === "agent" ? "Agent" : "Chat"}</span>
              <svg
                viewBox="0 0 24 24"
                className={`h-5 w-5 transition-transform duration-150 ${menuOpen ? "rotate-180" : ""}`}
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M11.5263 15.582C11.8209 15.8223 12.2556 15.8049 12.5302 15.5303L17.5302 10.5303C17.8231 10.2374 17.8231 9.76263 17.5302 9.46973C17.2373 9.17684 16.7626 9.17684 16.4697 9.46973L11.9999 13.9395L7.53022 9.46973C7.23732 9.17684 6.76256 9.17684 6.46967 9.46973C6.17678 9.76263 6.17678 10.2374 6.46967 10.5303L11.4697 15.5303L11.5263 15.582Z" />
              </svg>
            </button>
            {menuOpen && <BuildModeMenu mode={mode} onPick={pickMode} />}
          </div>
          <button
            type="button"
            aria-label="Start voice recording"
            className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-white/5"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M19.348 13.001c0.517 0 0.89 0.5 0.683 0.975a8.753 8.753 0 0 1-7.28 5.24V21.25h1.25a0.75 0.75 0 0 1 0 1.5h-4a0.75 0.75 0 0 1 0-1.5h1.25v-2.032a8.754 8.754 0 0 1-7.281-5.242c-0.206-0.476 0.165-0.975 0.683-0.975a0.83 0.83 0 0 1 0.745 0.499 7.253 7.253 0 0 0 13.205 0 0.83 0.83 0 0 1 0.745-0.499Z" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 1.75a4.75 4.75 0 0 1 4.75 4.75v4a4.75 4.75 0 0 1-9.5 0v-4A4.75 4.75 0 0 1 12 1.75Zm0 1.5a3.25 3.25 0 0 0-3.25 3.25v4a3.25 3.25 0 0 0 6.5 0v-4a3.25 3.25 0 0 0-3.25-3.25Z"
              />
            </svg>
          </button>
          {hasText && (
            <button
              type="submit"
              aria-label="Send"
              className="menu-pop flex h-8 w-8 items-center justify-center rounded-full hero-gradient-btn text-white transition-transform hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                <path
                  d="M12 19V5m0 0l-6 6m6-6l6 6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

/**
 * Full-bleed hero — full-viewport, vertically centered, 1:1 with the live
 * freebuff.dev hero: eyebrow h1, 32px/600 balanced h2 headline, smoke sub,
 * white 28px composer at 38rem with typewriter placeholder.
 */
export function Hero() {
  return (
    <section className="hero-gradient relative -mt-14 flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-6 [@media(max-height:400px)]:justify-start [@media(max-height:400px)]:pb-6 [@media(max-height:400px)]:pt-[calc(48px+24px)]">
      <div className="relative mb-7 flex flex-col items-center px-4 text-center md:mb-9">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#22C55E]/25 bg-[#22C55E]/10 px-3 py-1 font-mono-code text-[12.5px] tracking-[0.08em] text-[#4ADE80] uppercase">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
            <path d="M13 2 L4.5 13.5 H10.5 L9.5 22 L19.5 9.5 H12.5 L13 2 Z" />
          </svg>
          AI App Builder
        </span>
        <h1 className="mb-3 block text-balance text-center font-mono-code text-[34px]/[1.08] font-semibold tracking-[-1.4px] text-charcoal md:text-[52px]/[1.05] md:tracking-[-2.2px]">
          Build something{" "}
          <span className="bg-gradient-to-r from-[#4ADE80] via-[#22C55E] to-[#38BDF8] bg-clip-text text-transparent">
            Freebuff
          </span>
        </h1>
        <p className="mt-2 max-w-[30ch] text-pretty text-base/6 font-normal text-dim-gray md:max-w-none md:text-lg/6">
          Prompt it. Ship it. Own it — full-stack apps from a single input.
        </p>
      </div>
      <div className="w-full max-w-3xl md:max-w-[38rem]">
        <PromptComposer />
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono-code text-[12.5px] text-smoke">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-[#4ADE80]" aria-hidden="true" />
          18 models wired in
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-[#38BDF8]" aria-hidden="true" />
          Desktop + web, one checkout
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-[#22C55E]" aria-hidden="true" />
          Your code, your keys
        </span>
      </div>
    </section>
  );
}

/**
 * "Trusted by top brands" — monochrome logo row (live /home content).
 */
export function Brands() {
  const logos = [
    { name: "Adidas", Logo: AdidasLogo, h: "h-5" },
    { name: "Asana", Logo: AsanaLogo, h: "h-6" },
    { name: "ElevenLabs", Logo: ElevenLabsLogo, h: "h-6" },
    { name: "Zendesk", Logo: ZendeskLogo, h: "h-6" },
    { name: "Workday", Logo: WorkdayLogo, h: "h-6" },
    { name: "Nvidia", Logo: NvidiaLogo, h: "h-6" },
  ];

  return (
    <section className="bg-parchment py-16">
      <div className="contain">
        <h2 className="text-center text-heading font-w480 text-charcoal">
          Trusted by top brands
        </h2>
        <p className="mx-auto mt-3 max-w-[560px] text-center text-body text-dim-gray">
          Top companies empower their employees to create with Freebuff. Join
          them today and build the software that runs your business.
        </p>
        <div className="mt-8 flex justify-center">
          <a
            href="/customers"
            className="rounded-buttons border border-linen-border px-2.5 py-1.5 text-[15px] text-ink transition-colors hover:border-stone"
          >
            Learn more
          </a>
        </div>
        <div className="mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-x-12 hover:[animation-play-state:paused]">
            {[...logos, ...logos, ...logos, ...logos].map(({ name, Logo, h }, i) => (
              <span
                key={`${name}-${i}`}
                className="shrink-0 text-charcoal opacity-60 transition-opacity hover:opacity-100"
                aria-hidden={i >= logos.length}
              >
                <Logo className={`${h} w-auto`} />
                <span className="sr-only">{name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * "Meet Freebuff" — statement band that introduces the product pillars.
 */
export function MeetFreebuff() {
  return (
    <section className="bg-parchment py-24">
      <div className="contain">
        <h2 className="max-w-[14ch] text-[clamp(40px,6vw,72px)] font-w480 leading-[1.02] tracking-[-1.5px] text-charcoal">
          Meet Freebuff
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <p className="max-w-[480px] text-heading text-charcoal">
            Your AI cofounder and dev team.
          </p>
          <p className="max-w-[520px] text-body text-dim-gray">
            Your idea doesn&apos;t need a technical cofounder. Describe what you
            want — Freebuff designs it, builds it, and ships it with you. Full
            stack, production ready, and entirely yours.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * "Tools for founders — Build your dream" band with gradient blob headline.
 */
export function FoundersDream() {
  return (
    <section className="bg-parchment py-24">
      <div className="contain text-center">
        <p className="text-body font-semibold text-charcoal">Tools for founders</p>
        <h2 className="mt-6 text-[clamp(48px,7vw,88px)] font-w480 leading-[0.95] tracking-[-2px] text-charcoal">
          Build your
          <span className="relative mx-3 inline-flex h-[1.05em] w-[2.6em] items-center justify-center align-middle">
            <span
              className="absolute inset-0 rounded-[999px] bg-charcoal/90 blur-[2px]"
              aria-hidden="true"
            />
            <span className="relative text-[0.9em] text-parchment">dream</span>
          </span>
          today
        </h2>
        <p className="mx-auto mt-8 max-w-[560px] text-body text-charcoal">
          Freebuff is your AI cofounder and development team. Ship your ideas in
          days, not months — and start building the business you&apos;ve been
          dreaming about.
        </p>
        <a
          href="/new"
          className="mt-8 inline-flex items-center justify-center rounded-buttons bg-charcoal/90 px-5 py-2.5 text-body text-parchment transition-colors hover:bg-charcoal"
        >
          Start building
        </a>
      </div>
    </section>
  );
}

/** Shared card footer text (live copy) for the three building cards. */
function CardCaption({ title, body }: { title: string; body: string }) {
  return (
    <div className="relative flex flex-col gap-y-2 p-4 md:p-6">
      <h3 className="text-balance text-base/6 font-semibold text-charcoal">{title}</h3>
      <p className="max-w-[27rem] text-sm/6 font-normal text-[#616161]">{body}</p>
    </div>
  );
}

const CARD_SHADOW = "lov-card-shadow";

/**
 * Card 1 — chat-composer mockup over a prismatic bar + soft blue chip prompt.
 */
function CardIdea({ className }: { className?: string }) {
  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        .animate-blink {
          animation: blink 1.4s ease-in-out infinite;
        }
      `}</style>
      <div
        data-testid="home-building-card"
        className={`${className || ""} relative isolate grid min-h-[425px] grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-2xl bg-white ${CARD_SHADOW} lg:min-h-[480px] xl:min-h-[425px]`}
      >
        <div aria-hidden="true">
          <div className="h-[425px] w-full pt-14 pl-11 md:pt-18 md:pl-12">
            <div className="relative">
              <div className="lov-prism-bar absolute -top-2 -left-2 h-[calc(100%+40px)] w-[520px] rounded-t-3xl opacity-45 blur-[96px]" />
              <div className="lov-prism-bar absolute -top-2 -left-2 h-[calc(100%+16px)] w-[520px] rounded-t-3xl opacity-20 blur-md" />
              <div className="lov-prism-bar absolute -top-1 -left-1 h-[calc(100%+8px)] w-[520px] rounded-2xl opacity-20 blur-[38px]" />
              <div className="absolute inset-0 rounded-xl bg-white" />
              <div className="relative h-42 w-[520px] rounded-xl bg-white py-4 pl-6">
                <div className="flex items-center gap-x-0.5">
                  <div className="h-8 w-0.5 rounded-full bg-charcoal/40 animate-blink" />
                  <div className="text-xl/6 font-normal text-dim-gray/40">
                    Create an online store...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CardCaption
          title="You bring the idea. Freebuff brings it to life."
          body="Describe what you want in plain language. Watch as Freebuff builds production-grade software with you in real time."
        />
      </div>
    </>
  );
}

/** Preview-tab pill group (globe / doc / code / layers) — 16px, 1.25 stroke. */
function PreviewTabs() {
  return (
    <div className="flex w-fit rounded-full bg-white shadow-[0_0_0_0.75px_#EEECEB]">
      <div className="flex items-center gap-x-1.5 rounded-full bg-[#E9EEFE] py-0.5 pl-1 pr-2 text-[#1F55F1] shadow-[0_0_0_0.75px_#BDCEFB]">
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true">
          <path
            stroke="#1F55F1"
            strokeWidth="1.25"
            d="M8 1.75a6.25 6.25 0 1 1 0 12.5m0-12.5a6.25 6.25 0 1 0 0 12.5m0 0c1.547 0 2.802-2.798 2.802-6.25S9.547 1.75 8 1.75m0 12.5c-1.547 0-2.802-2.798-2.802-6.25S6.453 1.75 8 1.75M2.412 5.198h11.176m0 5.604H2.412"
          />
        </svg>
        <span className="text-xs/5 font-semibold">Preview</span>
      </div>
      <div className="flex items-center gap-x-2 pl-2.5 pr-2.5 text-[#5F5F5D]/70">
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true">
          <path
            stroke="#5F5F5D"
            strokeLinecap="round"
            strokeOpacity="0.7"
            strokeWidth="1.25"
            d="M4.75 8.25h3.5m-3.5 3h5.5m3.56-5.94L9.69 1.19A1.5 1.5 0 0 0 8.628.75H3.75a2 2 0 0 0-2 2v10.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2V6.371a1.5 1.5 0 0 0-.44-1.06Z"
          />
          <path
            stroke="#5F5F5D"
            strokeLinecap="round"
            strokeOpacity="0.7"
            strokeWidth="1.25"
            d="M9.25 1v3.25a1.5 1.5 0 0 0 1.5 1.5H14"
          />
        </svg>
        <div className="h-3 w-px bg-[#B5B5B4]/30" />
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true">
          <path
            stroke="#5F5F5D"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.7"
            strokeWidth="1.25"
            d="M4.25 5.75 1.75 8l2.5 2.25m5-8.5-2.5 12.5m5-8.5L14.25 8l-2.5 2.25"
          />
        </svg>
        <div className="h-3 w-px bg-[#B5B5B4]/30" />
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true">
          <path
            stroke="#5F5F5D"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.7"
            strokeWidth="1.5"
            d="M1.75 4 8 .75 14.25 4 8 7.25 1.75 4Zm0 4L8 11.25 14.25 8m-12.5 4L8 15.25 14.25 12"
          />
        </svg>
      </div>
    </div>
  );
}

/**
 * Card 2 — Preview-tab browser mockup (left) + design view with h1 tag,
 * dashed selection frame and cursor (right).
 */
function CardRefine({ className }: { className?: string }) {
  return (
    <div
      data-testid="home-building-card"
      className={`${className || ""} relative isolate grid min-h-[425px] grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-2xl bg-white ${CARD_SHADOW} lg:min-h-[480px] xl:min-h-[425px]`}
    >
      <div aria-hidden="true">
        <div className="grid h-80 w-full overflow-hidden *:col-start-1 *:row-start-1">
          <div className="relative size-full pt-8 pl-8 md:pt-10 md:pl-10">
            <div className="lov-prism-bar absolute bottom-6 left-10 h-52 w-[520px] rounded-t-3xl opacity-70 blur-[80px]" />
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_1px_0_rgba(0,0,0,0.08),0_2px_5px_0_rgba(0,0,0,0.10),0_12px_40px_-8px_rgba(0,0,0,0.12),0_4px_34px_-5px_rgba(0,0,0,0.08)]" />
              <div className="relative">
                <div className="p-3">
                  <PreviewTabs />
                </div>
                <div className="ml-2 flex w-[290px] flex-col items-start rounded bg-[#F9F8F5] pb-16 pl-6 pt-8 shadow-[0_0_0_0.75px_rgba(0,0,0,0.06)]">
                  <div className="relative w-fit">
                    {/* dashed selection frame — the "design view" edit state */}
                    <div className="absolute -inset-1.5 border border-dashed border-[#1F55F1]/60" />
                    <span className="absolute -right-9 -top-2 rounded-full bg-[#1F55F1] px-[9.5px] text-[11px]/5 font-semibold text-white">
                      h1
                    </span>
                    <span className="absolute -bottom-4 -right-1.5">
                      <svg
                        width="16"
                        height="23"
                        fill="none"
                        viewBox="0 0 11.591 16.422"
                        className="block"
                        aria-hidden="true"
                      >
                        <path
                          fill="#fff"
                          d="M0 16.422V.407l11.591 11.619H4.55l-.151.124z"
                        />
                        <path fill="#000" d="M1 2.814v11.188l2.969-2.866.16-.139h5.036z" />
                      </svg>
                    </span>
                    <div className="text-xl/7 font-semibold text-[#696661]">
                      Bug tracking for teams
                      <br />
                      that ship fast
                    </div>
                  </div>
                  <div className="mt-4 w-full text-[13px]/5.5 font-normal text-[#A59781]">
                    Purpose-built for engineering teams. Triage, track, and
                    resolve issues without slowing down.
                  </div>
                  <div className="mt-4 rounded bg-[#666054] px-3 py-2 text-sm/5.5 font-semibold text-white">
                    Get started for free
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CardCaption
        title="Refine your design and deploy"
        body="Iterate on your creation until you’re happy with the finished product. Then ship your idea and start using it immediately."
      />
    </div>
  );
}

const PLATFORM_PILLS = [
  "Analytics",
  "Cloud",
  "Connectors",
  "Security",
  "Agent integrations",
  "Payments",
  "SEO & AI search",
] as const;

/**
 * Card 3 — left: pill list (live icons); right: warm page surface with a
 * rotated prismatic glow behind it. Hovering a pill reveals its drop-in
 * indicator; clicking selects it, keeping the indicator open until another
 * pill is picked.
 */
function CardDepend({ className }: { className?: string }) {
  // Start on "Connectors" to match the live site's preselected row.
  const [activePill, setActivePill] = useState(2);

  return (
    <div
      data-testid="home-building-card"
      className={`${className || ""} relative isolate grid min-h-[425px] grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-2xl bg-white ${CARD_SHADOW} lg:min-h-[480px] xl:min-h-[425px]`}
    >
      <div aria-hidden="true">
        <div className="relative h-80 w-full overflow-hidden pl-8 md:pl-14">
          <div
            className="absolute top-20 left-0 h-52 w-[336px] rounded-b-3xl -rotate-17 opacity-60 blur-[80px]"
            style={{
              background:
                "linear-gradient(to top, #FD49A8 0%, #FD2980 10%, #FC1A58 20%, #FA1F41 30%, #FA2733 40%, #FB3D26 50%, #FC541F 60%, #FE6A1E 70%, #FE771D 80%, #FF861B 90%, #FF8F1B 100%)",
            }}
          />
          <div className="relative flex size-full gap-x-3 pt-10 pl-6">
            <div className="flex min-w-[154px] flex-col items-start gap-y-1">
              {PLATFORM_PILLS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={activePill === i}
                  onClick={() => setActivePill(i)}
                  className={`group relative flex items-center gap-x-2 rounded-lg py-1 pl-2 pr-3 text-left transition-colors ${
                    activePill === i ? "bg-[#616161]/10" : "hover:bg-[#616161]/5"
                  }`}
                >
                  <span className={`${activePill === i ? "text-black" : "text-[#989898]"} group-hover:text-black transition-colors duration-200`}>
                    <svg viewBox="0 0 24 24" className="h-6 w-6 pill-icon transition-all duration-200 group-hover:scale-110" fill="currentColor" aria-hidden="true">
                      {i === 0 && (
                        <path d="M3.25 18V4C3.25 3.58579 3.58579 3.25 4 3.25C4.41421 3.25 4.75 3.58579 4.75 4V18C4.75 18.6904 5.30964 19.25 6 19.25H20C20.4142 19.25 20.75 19.5858 20.75 20C20.75 20.4142 20.4142 20.75 20 20.75H6C4.48122 20.75 3.25 19.5188 3.25 18ZM19.4697 7.46973C19.7626 7.17683 20.2374 7.17683 20.5303 7.46973C20.8232 7.76262 20.8232 8.23738 20.5303 8.53027L14.5303 14.5303C14.2374 14.8232 13.7626 14.8232 13.4697 14.5303L11 12.0605L8.53027 14.5303C8.23738 14.8232 7.76262 14.8232 7.46973 14.5303C7.17683 14.2374 7.17683 13.7626 7.46973 13.4697L10.4697 10.4697L10.5264 10.418C10.8209 10.1777 11.2557 10.1951 11.5303 10.4697L14 12.9395L19.4697 7.46973Z" />
                      )}
                      {i === 1 && (
                        <path d="M2.25 14.5C2.25 12.4048 3.47715 10.5981 5.25 9.75586V9.5C5.25 6.6005 7.6005 4.25 10.5 4.25C13.3157 4.25 15.6137 6.46659 15.7441 9.25H16.5127C19.4062 9.25702 21.75 11.6048 21.75 14.5C21.75 17.3995 19.3995 19.75 16.5 19.75H7.5C4.6005 19.75 2.25 17.3995 2.25 14.5ZM6.75 10.2559C6.75 10.5737 6.54961 10.8569 6.25 10.9629C4.7925 11.478 3.75 12.8684 3.75 14.5C3.75 16.5711 5.42893 18.25 7.5 18.25H16.5C18.5711 18.25 20.25 16.5711 20.25 14.5C20.25 12.4967 18.6792 10.8599 16.7021 10.7549L16.5098 10.75H15C14.5858 10.75 14.25 10.4142 14.25 10V9.5C14.25 7.42893 12.5711 5.75 10.5 5.75C8.42893 5.75 6.75 7.42893 6.75 9.5V10.2559Z" />
                      )}
                      {i === 2 && (
                        <path d="M19.25 7C19.25 5.75736 18.2426 4.75 17 4.75C15.7574 4.75 14.75 5.75736 14.75 7C14.75 8.24264 15.7574 9.25 17 9.25C18.2426 9.25 19.25 8.24264 19.25 7ZM9.25 7C9.25 5.75736 8.24264 4.75 7 4.75C5.75736 4.75 4.75 5.75736 4.75 7C4.75 8.24264 5.75736 9.25 7 9.25C8.24264 9.25 9.25 8.24264 9.25 7ZM4.75 17C4.75 18.2426 5.75736 19.25 7 19.25C8.24264 19.25 9.25 18.2426 9.25 17C9.25 15.7574 8.24264 14.75 7 14.75C5.75736 14.75 4.75 15.7574 4.75 17ZM10.75 7C10.75 9.07107 9.07107 10.75 7 10.75C4.92893 10.75 3.25 9.07107 3.25 7C3.25 4.92893 4.92893 3.25 7 3.25C9.07107 3.25 10.75 4.92893 10.75 7ZM20.75 7C20.75 8.81421 19.4617 10.3273 17.75 10.6748V14C17.75 16.0711 16.0711 17.75 14 17.75H10.6748C10.3273 19.4617 8.81421 20.75 7 20.75C4.92893 20.75 3.25 19.0711 3.25 17C3.25 14.9289 4.92893 13.25 7 13.25C8.81421 13.25 10.3273 14.5383 10.6748 16.25H14C15.2426 16.25 16.25 15.2426 16.25 14V10.6748C14.5383 10.3273 13.25 8.81421 13.25 7C13.25 4.92893 14.9289 3.25 17 3.25C19.0711 3.25 20.75 4.92893 20.75 7Z" />
                      )}
                      {i === 3 && (
                        <path d="M19.25 6.69342C19.25 6.58925 19.1854 6.49567 19.0879 6.45904L12.0879 3.83404C12.0313 3.81282 11.9687 3.81282 11.9121 3.83404L4.91211 6.45904C4.8146 6.49567 4.75 6.58925 4.75 6.69342V12.0001C4.75 14.6815 6.31114 16.738 8.09375 18.1641C8.97958 18.8728 9.8967 19.4055 10.6475 19.7588C11.0225 19.9353 11.3488 20.064 11.6016 20.1465C11.8813 20.2379 12.0029 20.2501 12 20.2501C11.997 20.2501 12.1187 20.2379 12.3984 20.1465C12.6512 20.064 12.9775 19.9353 13.3525 19.7588C14.1033 19.4055 15.0204 18.8728 15.9062 18.1641C17.6889 16.738 19.25 14.6815 19.25 12.0001V6.69342ZM20.75 12.0001C20.75 15.3186 18.8111 17.7621 16.8438 19.336C15.8546 20.1273 14.8342 20.7196 13.9912 21.1163C13.5696 21.3147 13.1846 21.4674 12.8633 21.5723C12.5689 21.6684 12.2529 21.7501 12 21.7501C11.7471 21.7501 11.4311 21.6684 11.1367 21.5723C10.8154 21.4674 10.4304 21.3147 10.0088 21.1163C9.16581 20.7196 8.1454 20.1273 7.15625 19.336C5.18886 17.7621 3.25 15.3186 3.25 12.0001V6.69342C3.25 5.96394 3.70271 5.31088 4.38574 5.05475L11.3857 2.42975C11.7819 2.28123 12.2181 2.28123 12.6143 2.42975L19.6143 5.05475C20.2973 5.31088 20.75 5.96394 20.75 6.69342V12.0001Z" />
                      )}
                      {i === 4 && (
                        <path d="M13.5912 4.75216C12.7125 3.87348 11.2879 3.87348 10.4092 4.75216L4.75235 10.409C3.87367 11.2877 3.87367 12.7123 4.75235 13.591L10.4092 19.2478C11.2879 20.1265 12.7125 20.1265 13.5912 19.2478L19.248 13.591C20.1267 12.7123 20.1267 11.2877 19.248 10.409L13.5912 4.75216ZM20.3087 9.34835C21.7732 10.8128 21.7732 13.1872 20.3087 14.6517L14.6518 20.3085C13.1874 21.773 10.813 21.773 9.34854 20.3085L3.69169 14.6517C2.22722 13.1872 2.22722 10.8128 3.69169 9.34835L9.34854 3.6915C10.813 2.22703 13.1874 2.22703 14.6518 3.6915L20.3087 9.34835Z" />
                      )}
                      {i === 5 && (
                        <path d="M20.25 9.75H3.75V16C3.75 17.2426 4.75736 18.25 6 18.25H18C19.2426 18.25 20.25 17.2426 20.25 16V9.75ZM10 14.25C10.4142 14.25 10.75 14.5858 10.75 15C10.75 15.4142 10.4142 15.75 10 15.75H7C6.58579 15.75 6.25 15.4142 6.25 15C6.25 14.5858 6.58579 14.25 7 14.25H10ZM20.25 8C20.25 6.75736 19.2426 5.75 18 5.75H6C4.75736 5.75 3.75 6.75736 3.75 8V8.25H20.25V8ZM21.75 16C21.75 18.0711 20.0711 19.75 18 19.75H6C3.92893 19.75 2.25 18.0711 2.25 16V8C2.25 5.92893 3.92893 4.25 6 4.25H18C20.0711 4.25 21.75 5.92893 21.75 8V16Z" />
                      )}
                      {i === 6 && (
                        <path d="M17.25 11a6.25 6.25 0 1 0-12.5 0 6.25 6.25 0 0 0 12.5 0m1.5 0c0 1.87-.663 3.585-1.766 4.924l4.046 4.046a.75.75 0 1 1-1.06 1.06l-4.046-4.046A7.75 7.75 0 1 1 18.75 11" />
                      )}
                    </svg>
                  </span>
                  <span
                    className={`text-sm/6 font-normal ${activePill === i ? "text-black" : "text-[#616161]"}`}
                  >
                    {label}
                  </span>
                  {/* Drop-in stroke indicator — opens on hover and stays open
                      while the pill is the selected one (.pill-active). */}
                  <div
                    className={`pill-enter expand-indicator absolute left-1 top-full rounded-full bg-[#616161] ${
                      activePill === i ? "pill-active" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
            <div className="flex-1 rounded-tl bg-[#F9F8F5] shadow-[0_0_0_0.75px_rgba(0,0,0,0.06)]" />
          </div>
        </div>
      </div>
      <CardCaption
        title="Depend on Freebuff, from end to end"
        body="Freebuff handles your end-to-end infrastructure – from hosting and authentication to payments and integrations."
      />
    </div>
  );
}

/**
 * "One platform. Endless possibilities." — live /home building cards:
 * gradient-text-sweep heading, left-aligned copy, three 3D mockup cards.
 */
export function PlatformPanel() {
  return (
    <>
      <style>{`
        @keyframes reveal-up {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-reveal {
          opacity: 0;
          animation: reveal-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-reveal-1 { animation-delay: 0.05s; }
        .animate-reveal-2 { animation-delay: 0.15s; }
        .animate-reveal-3 { animation-delay: 0.25s; }

        /* Pill indicator — a small stroke that drops in under the hovered
           pill and grows into a 2×20 line; .pill-active (set by the click
           selection) keeps it open. Only one pill is active at a time, so
           switching pills animates the close of the previous stroke and the
           open of the new one. */
        .pill-enter.expand-indicator {
          width: 4px;
          height: 4px;
          opacity: 0;
          transform: translate(-1px, -6px);
          transition:
            width 0.3s cubic-bezier(0.16, 1, 0.3, 1),
            height 0.3s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.2s ease,
            transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .group:hover .pill-enter.expand-indicator,
        .pill-enter.pill-active {
          width: 2px;
          height: 20px;
          opacity: 1;
          transform: translate(-1px, 0);
        }

        /* SVG icon hover effect */
        .pill-icon {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .group:hover .pill-icon {
          transform: scale(1.15);
        }


      `}</style>
      <section id="platform" className="py-26 md:py-40">
        <div className="contain">
          <h2 className="mx-auto max-w-[clamp(320px,90vw,960px)] text-center text-4xl/[1.1] font-semibold tracking-[-1.44px] text-charcoal md:mx-0 md:text-left">
            One platform.{" "}
            <span className="gradient-text-sweep inline -mr-[0.1em] pr-[0.1em]">
              Endless possibilities.
            </span>
          </h2>
          <p className="mt-4 mx-auto max-w-[412px] text-base/6 font-normal text-[#616161] md:mx-0 md:text-left">
            If you can describe it, you can build it. Create, run, and manage
            entire products and businesses from scratch.
          </p>
        </div>
        <div className="contain mt-10 grid grid-cols-1 gap-y-3 md:mt-17 lg:grid-cols-3 lg:gap-x-3">
          <CardIdea className="animate-reveal animate-reveal-1" />
          <CardRefine className="animate-reveal animate-reveal-2" />
          <CardDepend className="animate-reveal animate-reveal-3" />
        </div>
      </section>
    </>
  );
}

/**
 * Legacy anchors preserved: the building cards now carry the #product and
 * #resources targets (as on the live site, where these sections merged into
 * the "One platform" grid).
 */
export function LegacyAnchors() {
  return (
    <>
      <span id="product" aria-hidden="true" className="block h-0" />
      <span id="resources" aria-hidden="true" className="block h-0" />
    </>
  );
}

/**
 * "For building and beyond" — live /home: dark rounded card (charcoal),
 * sticky title rail on desktop, scrolling platform cards with product diagrams.
 */
export function BuildingSection() {
  const PX = px("/");
  const features = [
    {
      title: "Hosting, handled",
      body: "Freebuff handles hosting, SSL, and backend infrastructure. Your code and data stay yours. Always.",
      img: `${PX}/home-platform-hosting-v11.svg`,
      imgMobile: null as string | null,
    },
    {
      title: "Your app stack, connected",
      body: "Connect to your tech stack, and build from the tools you already use. No integration code to write or maintain.",
      img: `${PX}/home-platform-stack-v6.svg`,
      imgMobile: null as string | null,
    },
    {
      title: "Payments, processed",
      body: "Local payments, currency conversion, and tax compliance handled in 200+ countries and territories.",
      img: `${PX}/home-platform-payments-v6.svg`,
      imgMobile: null as string | null,
    },
    {
      title: "Safe and secure, as standard",
      body: "Meet security and compliance requirements with automatic scans and audit logs.",
      img: `${PX}/home-platform-safe-v10.svg`,
      imgMobile: `${PX}/home-platform-safe-mobile-v10.svg`,
    },
    {
      title: "Works wherever, whenever",
      body: "Build and manage your projects on web, desktop, and mobile, or from your favorite tools and platforms.",
      img: `${PX}/home-platform-wherever-v11.svg`,
      imgMobile: `${PX}/home-platform-wherever-mobile-v11.svg`,
    },
  ];

  return (
    <section className="mx-auto max-w-[1536px] bg-parchment px-2 py-8 md:py-12">
      <div className="rounded-2xl bg-charcoal px-4 pb-2 pt-16 shadow-[0_1px_1px_0_rgba(27,27,27,0.20),0_4px_34px_-5px_rgba(27,27,27,0.10)] md:px-6 md:pb-24 lg:px-12 lg:py-20">
        <div className="mx-auto grid w-full max-w-[704px] gap-x-20 lg:max-w-[1344px] lg:grid-cols-[368px_1fr] lg:items-start">
          <div className="flex flex-col justify-between gap-y-8 self-start lg:sticky lg:top-28">
            <div>
              <h2 className="text-balance text-4xl/[1.1] font-semibold tracking-[-1.44px] text-white">
                For building{" "}
                <span className="gradient-text-sweep-light inline -mr-[0.1em] pr-[0.1em]">
                  and beyond
                </span>
              </h2>
              <p className="mt-4 max-w-[480px] text-base/6 text-[#C5C1B9] md:text-lg/7">
                Freebuff runs on enterprise-grade infrastructure — so you can create
                full-stack software that scales.
              </p>
            </div>
            <p className="hidden text-sm/6 text-[#C5C1B9]/70 lg:block">
              Depend on Freebuff, from end to end.
            </p>
          </div>
          <div className="mt-12 flex flex-col gap-y-16 lg:mt-0">
            {features.map((f) => (
              <div key={f.title}>
                <h3 className="text-base/6 font-semibold text-white">{f.title}</h3>
                <p className="mt-2 max-w-[440px] text-sm/6 font-normal text-[#C6C1B8]">{f.body}</p>
                <div className="-mx-2 mt-6 overflow-hidden rounded-xl bg-black/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] md:mx-0">
                  <img
                    src={f.img}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className={`h-[420px] w-full max-w-full object-cover md:h-[580px] ${f.imgMobile ? "hidden md:block" : ""}`}
                  />
                  {f.imgMobile && (
                    <img
                      src={f.imgMobile}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="h-[420px] w-full max-w-full object-cover md:hidden"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Remix toast — charcoal pill bottom-center, auto-dismisses.
 */
function RemixToast({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="menu-pop fixed bottom-6 left-1/2 z-[110] flex -translate-x-1/2 items-center gap-2.5 rounded-buttons bg-charcoal px-4 py-2.5 text-[14px] text-parchment shadow-subtle-2"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" aria-hidden="true">
        <path
          d="M5 12l5 5 9-11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {message}
    </div>
  );
}

/**
 * Template detail modal — Freebuff dialog style: dark scrim, white rounded
 * card, X close, dark pill CTA. Esc closes, ←/→ navigate the filtered list.
 */
function TemplateModal({
  template,
  onClose,
  onPrev,
  onNext,
  onRemix,
}: {
  template: Template;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onRemix: (t: Template) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgb(3_3_3/0.55)] p-4"
      role="dialog"
      aria-modal="true"
      aria-label={template.title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="menu-pop relative w-full max-w-[760px] rounded-3xl bg-white p-6 shadow-subtle-2 sm:p-8">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-dim-gray transition-colors hover:bg-charcoal/5 hover:text-charcoal"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative overflow-hidden rounded-2xl border border-linen-border">
          <Image
            src={template.src}
            alt={template.title}
            width={1200}
            height={648}
            className="aspect-[496/268] w-full object-cover"
            priority
          />
          <button
            type="button"
            aria-label="Previous template"
            onClick={onPrev}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-charcoal shadow-subtle transition-colors hover:bg-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next template"
            onClick={onNext}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-charcoal shadow-subtle transition-colors hover:bg-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path d="M10 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <h3 className="mt-6 text-heading font-w480 text-charcoal">{template.title}</h3>
        <p className="mt-2 text-body text-dim-gray">{template.desc}</p>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onRemix(template)}
            className="inline-flex items-center justify-center rounded-buttons bg-charcoal/88 px-4 py-2.5 text-[15px] text-parchment transition-colors hover:bg-charcoal"
          >
            Remix this template
          </button>
        </div>
      </div>
    </div>
  );
}

type Template = {
  title: string;
  desc: string;
  src: string;
  cat: string;
};

const TEMPLATE_CATEGORIES = ["All", "Portfolio", "Blog", "Web App", "Ecommerce"] as const;

/**
 * Template gallery — real screenshots cropped from the reference, category
 * filter chips, detail modal with ←/→ navigation and a remix toast.
 */
export function Templates() {
  const router = useRouter();
  const [category, setCategory] = useState<string>("All");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const templates: Template[] = [
    { title: "Personal portfolio", desc: "Personal work showcase", src: "/templates/t1.jpg", cat: "Portfolio" },
    { title: "Freebuff slides", desc: "Code-powered presentation builder", src: "/templates/t2.jpg", cat: "Web App" },
    { title: "Architect Portfolio Website Template", desc: "Firm website & showcase", src: "/templates/t3.jpg", cat: "Portfolio" },
    { title: "Fashion blog", desc: "Minimal, playful design", src: "/templates/t4.jpg", cat: "Blog" },
    { title: "Event Platform Website Template", desc: "Find, register, create events", src: "/templates/t5.jpg", cat: "Web App" },
    { title: "Personal blog", desc: "Muted, intimate design", src: "/templates/t6.jpg", cat: "Blog" },
    { title: "Lifestyle Blog", desc: "Sophisticated blog design", src: "/templates/t7.jpg", cat: "Blog" },
    { title: "Ecommerce Store Website Template", desc: "Premium design for webstore", src: "/templates/t8.jpg", cat: "Ecommerce" },
  ];

  const filtered = templates.filter(
    (t) => category === "All" || t.cat === category,
  );

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const remix = (t: Template) => {
    setActiveIdx(null);
    setToast(`Remixing “${t.title}” — starting a new project`);
    setTimeout(() => {
      router.push(`/new?q=${encodeURIComponent(`Remix the ${t.title} template`)}`);
    }, 900);
  };

  const active = activeIdx === null ? null : filtered[activeIdx] ?? null;
  const step = (dir: 1 | -1) =>
    setActiveIdx((i) =>
      i === null || filtered.length === 0
        ? i
        : (i + dir + filtered.length) % filtered.length,
    );

  return (
    <section id="templates" className="bg-parchment py-20">
      <div className="contain">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-heading-lg font-w480 text-charcoal">
              Discover templates
            </h2>
            <p className="mt-2 text-body text-dim-gray">
              Start your next project with a template
            </p>
          </div>
          <a
            href="/templates"
            className="rounded-buttons border border-linen-border px-2.5 py-1.5 text-[15px] text-ink transition-colors hover:border-stone"
          >
            View all
          </a>
        </div>

        {/* Category filter chips */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {TEMPLATE_CATEGORIES.map((cat) => {
            const isActive = category === cat;
            const count =
              cat === "All"
                ? templates.length
                : templates.filter((t) => t.cat === cat).length;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setCategory(cat);
                  setActiveIdx(null);
                }}
                className={`flex items-center gap-1.5 rounded-buttons px-3.5 py-1.5 text-[14px] transition-colors ${
                  isActive
                    ? "bg-charcoal/88 text-parchment"
                    : "border border-linen-border text-charcoal hover:border-stone"
                }`}
              >
                {cat}
                <span className={`text-[12px] ${isActive ? "text-parchment/60" : "text-dim-gray"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((t, i) => (
            <button
              key={t.title}
              type="button"
              onClick={() => setActiveIdx(i)}
              className="group text-left"
            >
              <div className="overflow-hidden rounded-images transition-shadow group-hover:shadow-subtle-2">
                <Image
                  src={t.src}
                  alt={t.title}
                  width={496}
                  height={268}
                  className="aspect-[496/268] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <p className="mt-2 text-body font-w480 text-charcoal">{t.title}</p>
              <p className="mt-0.5 text-caption text-dim-gray">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <TemplateModal
          template={active}
          onClose={() => setActiveIdx(null)}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onRemix={remix}
        />
      )}
      {toast && <RemixToast message={toast} />}
    </section>
  );
}

/**
 * Pricing — three tiers + monthly/yearly toggle, achromatic per the system:
 * warm-sand cards, no colored CTAs, Pro highlighted as the inverse moment.
 */
export function Pricing() {
  const [yearly, setYearly] = useState(true);

  const tiers = [
    {
      name: "Free",
      monthly: 0,
      yearly: 0,
      tagline: "For trying things out",
      cta: "Get started",
      featured: false,
      features: [
        "5 daily credits",
        "Public projects",
        "Community support",
        "Freebuff branding",
      ],
    },
    {
      name: "Pro",
      monthly: 25,
      yearly: 20,
      tagline: "For solo builders shipping fast",
      cta: "Start with Pro",
      featured: true,
      features: [
        "100 monthly credits",
        "Private projects",
        "Custom domains",
        "Remove Freebuff branding",
        "GitHub sync & code export",
      ],
    },
    {
      name: "Business",
      monthly: 50,
      yearly: 40,
      tagline: "For teams building together",
      cta: "Start with Business",
      featured: false,
      features: [
        "Everything in Pro",
        "Centralized billing",
        "Shared workspaces",
        "SSO & role controls",
        "Priority support",
      ],
    },
  ];

  return (
    <section id="pricing" className="bg-parchment py-24">
      <div className="contain">
        <h2 className="mx-auto max-w-[20ch] text-center text-heading-lg font-w480 text-charcoal">
          Pick the plan that fits
        </h2>
        <p className="mx-auto mt-4 max-w-[520px] text-center text-body text-dim-gray">
          Start free, upgrade when you ship. Credits reset monthly and unused
          credits roll over.
        </p>

        {/* Billing toggle */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center rounded-buttons border border-linen-border bg-warm-sand p-1">
            <button
              type="button"
              aria-pressed={!yearly}
              onClick={() => setYearly(false)}
              className={`rounded-buttons px-4 py-1.5 text-[15px] transition-colors ${
                !yearly ? "bg-charcoal/88 text-parchment" : "text-dim-gray hover:text-charcoal"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              aria-pressed={yearly}
              onClick={() => setYearly(true)}
              className={`flex items-center gap-2 rounded-buttons px-4 py-1.5 text-[15px] transition-colors ${
                yearly ? "bg-charcoal/88 text-parchment" : "text-dim-gray hover:text-charcoal"
              }`}
            >
              Yearly
              <span
                className={`rounded-buttons px-1.5 py-0.5 text-[11px] ${
                  yearly ? "bg-parchment/20 text-parchment" : "bg-charcoal/5 text-dim-gray"
                }`}
              >
                save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-[1020px] grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-3xl-2 p-7 ${
                tier.featured
                  ? "bg-charcoal text-parchment"
                  : "border border-linen-border bg-warm-sand text-charcoal"
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-7 rounded-buttons bg-parchment px-2.5 py-1 text-[11px] font-w480 text-charcoal shadow-subtle">
                  Most popular
                </span>
              )}
              <p className="text-body font-w480">{tier.name}</p>
              <p
                className={`mt-1 text-caption ${
                  tier.featured ? "text-parchment/60" : "text-dim-gray"
                }`}
              >
                {tier.tagline}
              </p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="text-[44px] font-w480 leading-none tracking-[-1.2px]">
                  ${yearly ? tier.yearly : tier.monthly}
                </span>
                <span
                  className={`text-caption ${
                    tier.featured ? "text-parchment/60" : "text-dim-gray"
                  }`}
                >
                  /month
                </span>
              </p>
              <p
                className={`mt-1 text-[12px] ${
                  tier.featured ? "text-parchment/60" : "text-dim-gray"
                }`}
              >
                {tier.monthly === 0
                  ? "free forever"
                  : yearly
                    ? `billed yearly ($${tier.yearly * 12}/yr)`
                    : "billed monthly"}
              </p>

              <a
                href="/new"
                className={`mt-6 inline-flex items-center justify-center rounded-buttons px-4 py-2 text-[15px] transition-colors ${
                  tier.featured
                    ? "bg-parchment text-charcoal hover:bg-white"
                    : "border border-linen-border bg-parchment text-charcoal hover:border-stone"
                }`}
              >
                {tier.cta}
              </a>

              <ul className="mt-7 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px]">
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-0.5 h-4 w-4 shrink-0"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 12l5 5 9-11"
                        stroke={tier.featured ? "rgb(252 251 248 / 0.7)" : "rgb(95 95 93 / 0.7)"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-body text-dim-gray">
          Need more control, security review, or custom limits?{" "}
          <a href="/enterprise" className="text-charcoal underline underline-offset-4 hover:text-ink">
            Talk to sales about Enterprise
          </a>
          .
        </p>
      </div>
    </section>
  );
}

/**
 * "The proof is in production" — live /home: logo tab switcher + featured
 * case card (quote, stats, avatar) + See-all link.
 */
export function Cases() {
  const PX = px("/");
  const cases = [
    {
      name: "eXp Realty",
      logo: `${PX}/home-cases-logo-exprealty.svg`,
      quote: "eXp Realty has cancelled millions in SaaS contracts for custom software built with Freebuff.",
      stats: [
        ["$2M+", "savings per year"],
        ["85%", "fewer support tickets"],
        ["83K", "remote agents connected"],
      ],
      avatar: null as string | null,
      person: "eXp Realty team",
    },
    {
      name: "Klar",
      logo: `${PX}/home-cases-logo-klar.svg`,
      quote: "These three students created an AI system from the ground up to help anyone learn faster.",
      stats: [
        ["€130K", "ARR in 30 days"],
        ["2500+", "users signed up in two days"],
        ["€7.5M", "ARR partnership announced"],
      ],
      avatar:
        px("/"),
      person: "Andreas Melander · Co-founder, Klar",
    },
    {
      name: "The Scion Group",
      logo: `${PX}/home-cases-logo-sciongroup.svg`,
      quote: "The Scion Group is all-in on Freebuff, with every department building custom tools to streamline their workflows.",
      stats: [
        ["$1M+", "SaaS contracts on track to be retired"],
        ["100+", "apps deployed in under four months"],
        ["$35K", "saved on the very first build"],
      ],
      avatar: null as string | null,
      person: "Scion Group team",
    },
    {
      name: "Nursa",
      logo: `${PX}/home-cases-logo-nursa.svg`,
      quote: "This healthcare platform built a new product in a weekend, and changed how its entire company ships software.",
      stats: [
        ["48", "hours to build a brand new product"],
        ["200+", "employees empowered to build"],
        ["10", "SaaS systems being retired"],
      ],
      avatar: null as string | null,
      person: "Nursa team",
    },
  ];
  const [active, setActive] = useState(1);
  const c = cases[active];

  return (
    <section id="stories" className="bg-warm-sand py-20">
      <div className="contain">
        <h2 className="mx-auto max-w-[24ch] text-center text-heading-lg font-w480 text-charcoal">
          The proof is in production
        </h2>
        <p className="mx-auto mt-4 max-w-[560px] text-center text-body text-dim-gray">
          These companies built the software they needed with Freebuff. Now they
          run their businesses on it.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Customer stories">
          {cases.map((item, i) => (
            <button
              key={item.name}
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`flex h-11 items-center rounded-full border px-5 transition-all duration-200 ${
                active === i
                  ? "border-charcoal/20 bg-white shadow-subtle"
                  : "border-transparent opacity-60 hover:bg-white/60 hover:opacity-100"
              }`}
            >
              <img src={item.logo} alt={item.name} loading="lazy" className="h-5 w-auto" />
            </button>
          ))}
        </div>

        <div key={c.name} className="menu-pop mx-auto mt-8 max-w-[860px] rounded-3xl border border-linen-border bg-white p-8 shadow-subtle md:p-10">
          <p className="text-balance text-center text-heading font-w480 leading-snug text-charcoal">
            “{c.quote}”
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
            {c.stats.map(([stat, label]) => (
              <div key={label}>
                <p className="text-heading font-w480 text-charcoal">{stat}</p>
                <p className="mt-1 text-caption leading-snug text-dim-gray">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-3">
            {c.avatar ? (
              <img src={c.avatar} alt="" aria-hidden="true" loading="lazy" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-sand text-sm font-medium text-charcoal">
                {c.name.charAt(0)}
              </span>
            )}
            <p className="text-[15px] font-w480 text-charcoal">{c.person}</p>
            <a
              href="/customers"
              className="ml-2 rounded-buttons border border-linen-border px-2.5 py-1 text-caption text-charcoal transition-colors hover:border-stone"
            >
              Read
            </a>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="/customers"
            className="rounded-buttons border border-linen-border bg-white px-2.5 py-1.5 text-[15px] text-ink transition-colors hover:border-stone"
          >
            See all customer stories
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * "Millions count on Freebuff" — big-number stats band.
 */
export function Stats() {
  const stats = [
    { value: "1.2 million", label: "New projects built every week" },
    { value: "60 million", label: "Projects built with Freebuff" },
    { value: "900 million", label: "Monthly visits to Freebuff-built projects" },
  ];

  return (
    <section className="bg-parchment py-24">
      <div className="contain text-center">
        <h2 className="mx-auto max-w-[24ch] text-heading-lg font-w480 text-charcoal">
          Millions count on Freebuff
        </h2>
        <p className="mx-auto mt-4 max-w-[560px] text-body text-dim-gray">
          People across the world are using Freebuff every day to solve problems
          and seize opportunities. Join them now and turn ‘someday’ into today.
        </p>
        <div className="mx-auto mt-14 grid max-w-[900px] grid-cols-1 gap-10 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-display font-w480 text-charcoal">{s.value}</p>
              <p className="mt-2 text-caption text-dim-gray">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
