"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Package, Search } from "lucide-react";
import {
  OLLAMA_MODELS,
  PROVIDERS,
  getOllamaModel,
  getProvider,
  modelTier,
  type AIProvider,
  type ModelSelection,
} from "@/lib/models";

type Props = {
  selection: ModelSelection;
  apiKeys: Record<string, string>;
  ollamaRunning?: boolean;
  ollamaModels: string[];
  onSelect: (sel: ModelSelection) => void;
  onKeyChange: (providerId: string, key: string) => void;
};

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
}

function shortName(model: string) {
  return model.split(":")[0];
}

function ModelButton({
  active,
  title,
  sub,
  onClick,
}: {
  active: boolean;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-full px-3 py-2 text-left transition-colors duration-200 ${
        active ? "bg-warm-sand" : "hover:bg-warm-sand/70"
      }`}
    >
      <span className="flex items-baseline justify-between gap-2">
        <span className="truncate text-[13px] text-charcoal">{title}</span>
        <span className={`shrink-0 text-[11px] ${active ? "text-charcoal" : "text-dim-gray"}`}>
          {sub}
        </span>
      </span>
    </button>
  );
}

function BrandRow({
  name,
  tier,
  note,
  onClick,
}: {
  name: string;
  tier?: string;
  note?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between gap-2 rounded-full px-3 py-2 text-left transition-colors duration-200 hover:bg-warm-sand/70"
    >
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 truncate text-[13px] font-medium text-charcoal">
          {name}
          {tier ? (
            <span
              className={`shrink-0 rounded-full px-1.5 py-px text-[10px] font-medium ${
                tier === "free" ? "bg-charcoal/[0.06] text-steel" : "bg-charcoal text-parchment"
              }`}
            >
              {tier}
            </span>
          ) : null}
        </span>
        {note ? <span className="block truncate text-[11px] text-dim-gray">{note}</span> : null}
      </span>
      <ChevronRight
        className="size-3.5 shrink-0 text-dim-gray transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden
      />
    </button>
  );
}

export default function ModelPicker({
  selection,
  apiKeys,
  ollamaRunning,
  ollamaModels,
  onSelect,
  onKeyChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [envReady, setEnvReady] = useState<Record<string, boolean>>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Which providers have a server-side env key (booleans only)
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch("/api/chat")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.providers) return;
        const map: Record<string, boolean> = {};
        for (const p of data.providers as { id: string; hasEnvKey: boolean }[]) {
          map[p.id] = p.hasEnvKey;
        }
        setEnvReady(map);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open]);

  const modelLabel = shortName(selection.model);

  // Mono size badge on the trigger (reference chip: model name + size + chevron)
  const badge = useMemo(() => {
    if (selection.source === "ollama") {
      return getOllamaModel(selection.model)?.size ?? "local";
    }
    const p = getProvider(selection.providerId);
    if (!p) return "api";
    return modelTier(p, selection.model) === "paid" ? "paid" : "free";
  }, [selection]);

  const q = query.trim().toLowerCase();
  const matchModel = (id: string, extra?: string) =>
    !q || id.toLowerCase().includes(q) || (extra ?? "").toLowerCase().includes(q);

  function pick(sel: ModelSelection) {
    onSelect(sel);
    setOpen(false);
    setQuery("");
  }

  /* ---------------- Brand list (level 1) ---------------- */

  const ollamaNote =
    ollamaRunning === undefined
      ? "Checking…"
      : ollamaRunning
        ? ollamaModels.length > 0
          ? `${ollamaModels.length} model installed`
          : "No models pulled yet"
        : "Not running — ollama serve";

  const brandList = (
    <>
      {/* Search — filters brands + flat model results */}
      <div className="sticky top-0 z-10 bg-parchment px-3 pb-2 pt-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-dim-gray" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search models…"
            aria-label="Search models"
            autoComplete="off"
            className="w-full rounded-full border border-linen-border bg-white py-1.5 pl-8 pr-3 text-[12px] text-charcoal outline-none placeholder:text-dim-gray/70 focus:border-stone"
          />
        </div>
      </div>

      {q ? (
        /* Search results: flat model matches grouped under their brand */
        <>
          {ollamaRunning && ollamaModels.filter((m) => matchModel(m)).length > 0 ? (
            <>
              <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-dim-gray">
                Ollama (local)
              </p>
              {ollamaModels
                .filter((m) => matchModel(m))
                .map((name) => (
                  <ModelButton
                    key={name}
                    active={selection.source === "ollama" && selection.model === name}
                    title={name}
                    sub="installed"
                    onClick={() => pick({ source: "ollama", model: name })}
                  />
                ))}
            </>
          ) : null}
          {OLLAMA_MODELS.filter((m) => !ollamaModels.includes(m.id) && matchModel(m.id, m.tag)).map(
            (m) => (
              <ModelButton
                key={m.id}
                active={selection.source === "ollama" && selection.model === m.id}
                title={`${m.tag}  ·  ${m.size}`}
                sub="ollama pull"
                onClick={() => pick({ source: "ollama", model: m.id })}
              />
            ),
          )}
          {PROVIDERS.map((p) => {
            const models = p.models.filter((m) => matchModel(m.id, m.label));
            if (!models.length) return null;
            return (
              <div key={p.id}>
                <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-dim-gray">
                  {p.name}
                </p>
                {models.map((m) => (
                  <ModelButton
                    key={m.id}
                    active={
                      selection.source === "remote" &&
                      selection.providerId === p.id &&
                      selection.model === m.id
                    }
                    title={m.label}
                    sub={modelTier(p, m.id)}
                    onClick={() => pick({ source: "remote", providerId: p.id, model: m.id })}
                  />
                ))}
              </div>
            );
          })}
        </>
      ) : (
        /* Level 1: main brands only */
        <>
          <BrandRow name="Ollama" note={ollamaNote} onClick={() => setActiveBrand("ollama")} />

          <p className="border-t border-linen-border px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-dim-gray">
            Flagship models
          </p>
          {PROVIDERS.filter((p) => p.tier === "paid").map((p) => (
            <BrandRow
              key={p.id}
              name={p.name}
              note={p.note}
              onClick={() => setActiveBrand(p.id)}
            />
          ))}

          <p className="border-t border-linen-border px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-dim-gray">
            Free APIs
          </p>
          {PROVIDERS.filter((p) => p.tier === "free").map((p) => (
            <BrandRow
              key={p.id}
              name={p.name}
              tier="free"
              note={p.note}
              onClick={() => setActiveBrand(p.id)}
            />
          ))}

          <p className="border-t border-linen-border px-3 pb-1 pt-3 text-[11px] text-dim-gray">
            Paid flagships need their own API key (or a server env var — green “ready” means it&apos;s
            configured). Free models from the{" "}
            <a
              href="https://github.com/nejib1/Free-LLM"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-stone underline-offset-2 hover:text-charcoal"
            >
              Free-LLM directory
            </a>{" "}
            — keys stay in your browser.
          </p>
        </>
      )}
    </>
  );

  /* ---------------- Model list of one brand (level 2) ---------------- */

  const ollamaPanel = (
    <>
      {ollamaRunning === undefined ? (
        <p className="px-3 pb-2 text-[13px] text-dim-gray">Checking local Ollama…</p>
      ) : ollamaRunning ? (
        <p className="px-3 pb-2 text-[12px] text-dim-gray">
          {ollamaModels.length > 0
            ? `${ollamaModels.length} model installed`
            : "No models pulled yet — run in a terminal:"}
        </p>
      ) : (
        <p className="px-3 pb-2 text-[12px] text-dim-gray">
          Ollama is not running — start it with <code className="text-charcoal">ollama serve</code>{" "}
          <a
            href="https://ollama.com/download"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-stone underline-offset-2 hover:text-charcoal"
          >
            (install)
          </a>
        </p>
      )}

      {ollamaModels.map((name) => (
        <ModelButton
          key={name}
          active={selection.source === "ollama" && selection.model === name}
          title={name}
          sub="installed"
          onClick={() => pick({ source: "ollama", model: name })}
        />
      ))}
      {OLLAMA_MODELS.filter((m) => !ollamaModels.includes(m.id)).map((m) => (
        <ModelButton
          key={m.id}
          active={selection.source === "ollama" && selection.model === m.id}
          title={`${m.tag}  ·  ${m.size}`}
          sub="ollama pull"
          onClick={() => pick({ source: "ollama", model: m.id })}
        />
      ))}
      {ollamaRunning && ollamaModels.length === 0 && (
        <p className="px-3 pb-2 pt-1 text-[12px] text-dim-gray">
          Then pick one — these are free &amp; private.
        </p>
      )}
    </>
  );

  const providerPanel = (p: AIProvider) => {
    const activeProvider = selection.source === "remote" && selection.providerId === p.id;
    const key = apiKeys[p.id] ?? "";
    const hasEnv = envReady[p.id] ?? false;
    return (
      <>
        <div className="flex items-center justify-between gap-2 px-3 pb-1 pt-2">
          <span className="flex items-center gap-1.5 text-[13px] font-semibold text-charcoal">
            {p.name}
            <span
              className={`rounded-full px-1.5 py-px text-[10px] font-medium ${
                p.tier === "free" ? "bg-charcoal/[0.06] text-steel" : "bg-charcoal text-parchment"
              }`}
            >
              {p.tier}
            </span>
            {hasEnv && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-steel">
                <span className="h-1.5 w-1.5 rounded-full bg-charcoal" />
                ready
              </span>
            )}
          </span>
          {p.envKey && hasEnv ? (
            <span className="shrink-0 text-[11px] text-dim-gray">env key</span>
          ) : (
            <a
              href={p.keyUrl}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-[11px] text-dim-gray underline decoration-stone underline-offset-2 hover:text-charcoal"
            >
              Get key ↗
            </a>
          )}
        </div>
        <p className="px-3 pb-1 text-[11px] text-dim-gray">{p.note}</p>
        {!hasEnv && (
          <input
            type="password"
            value={key}
            onChange={(e) => onKeyChange(p.id, e.target.value)}
            placeholder="Paste API key (stored in your browser)"
            className="mx-3 mb-1 w-[calc(100%-24px)] rounded-inputs border border-linen-border bg-white px-3 py-2 text-[12px] text-charcoal outline-none placeholder:text-dim-gray/60 focus:border-stone"
          />
        )}
        {activeProvider && hasEnv && (
          <p className="mx-3 mb-2 text-[11px] text-dim-gray">
            Authenticated server-side via the {p.envKey} environment variable — no key needed here.
          </p>
        )}
        {p.models.map((m) => (
          <ModelButton
            key={m.id}
            active={activeProvider && selection.model === m.id}
            title={m.label}
            sub={modelTier(p, m.id)}
            onClick={() => pick({ source: "remote", providerId: p.id, model: m.id })}
          />
        ))}
      </>
    );
  };

  const brandPanel = (() => {
    if (activeBrand === "ollama") return ollamaPanel;
    const p = PROVIDERS.find((x) => x.id === activeBrand);
    return p ? providerPanel(p) : null;
  })();

  const backBar = (
    <div className="flex items-center gap-1 px-2 pb-1 pt-2">
      <button
        type="button"
        onClick={() => setActiveBrand(null)}
        className="flex items-center gap-1 rounded-full px-2 py-1 text-[12px] text-dim-gray transition-colors hover:bg-warm-sand/70 hover:text-charcoal"
      >
        <ChevronLeft className="size-3.5" aria-hidden />
        Geri
      </button>
    </div>
  );

  return (
    <div ref={rootRef} className="relative">
      {/* Trigger: package icon + model name (truncate) + mono size badge + chevron */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex max-w-[240px] items-center gap-1.5 rounded-buttons border border-linen-border bg-white px-2.5 py-1.5 text-[13px] text-charcoal transition-colors duration-200 hover:border-stone focus:outline-none focus-visible:ring-2 focus-visible:ring-stone/30"
      >
        <Package className="size-3.5 shrink-0" aria-hidden />
        <span className="min-w-0 truncate font-medium">{modelLabel}</span>
        <span className="inline-flex shrink-0 items-center rounded-md border border-border/50 bg-charcoal/[0.06] px-1 py-0 font-mono text-[10px] leading-4 text-charcoal/80 dark:bg-foreground/10">
          {badge}
        </span>
        <ChevronDown
          className={`size-3.5 shrink-0 text-dim-gray transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {open && !isMobile ? (
        <div
          role="menu"
          className="absolute bottom-full right-0 z-30 mb-2 flex max-h-[70vh] overflow-hidden rounded-3xl border border-linen-border bg-parchment shadow-subtle-2"
        >
          {/* Level 1 — brands */}
          <div className="w-[300px] overflow-y-auto p-2">{brandList}</div>

          {/* Level 2 — models of the chosen brand (side panel) */}
          {activeBrand ? (
            <div className="w-[320px] overflow-y-auto border-l border-linen-border p-2">
              {backBar}
              {brandPanel}
            </div>
          ) : null}
        </div>
      ) : null}

      {open && isMobile ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close model picker"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-hidden rounded-t-3xl border-t border-linen-border bg-parchment pb-[env(safe-area-inset-bottom)] shadow-subtle-2">
            <div className="flex items-center justify-between px-4 pt-3">
              <span className="text-[13px] font-medium text-charcoal">Model seç</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-2 py-1 text-[12px] text-dim-gray hover:text-charcoal"
              >
                Kapat
              </button>
            </div>
            <div className="max-h-[calc(80dvh-44px)] overflow-y-auto p-2">
              {activeBrand ? (
                <>
                  {backBar}
                  {brandPanel}
                </>
              ) : (
                brandList
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
