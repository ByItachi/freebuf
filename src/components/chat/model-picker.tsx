"use client";

import { useEffect, useRef, useState } from "react";
import {
  OLLAMA_MODELS,
  PROVIDERS,
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

function Caret() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ShortModelName(model: string) {
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
      className={`w-full rounded-full px-3 py-2 text-left transition-colors ${
        active ? "bg-warm-sand" : "hover:bg-warm-sand/70"
      }`}
    >
      <span className="flex items-baseline justify-between gap-2">
        <span className="truncate text-[13px] text-charcoal">{title}</span>
        <span
          className={`shrink-0 text-[11px] ${active ? "text-charcoal" : "text-dim-gray"}`}
        >
          {sub}
        </span>
      </span>
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
  const [envReady, setEnvReady] = useState<Record<string, boolean>>({});
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

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

  const provider = selection.source === "remote" ? getProvider(selection.providerId) : undefined;
  const label = provider
    ? `${ShortModelName(selection.model)} \u00b7 ${provider.name}`
    : `${ShortModelName(selection.model)} \u00b7 Ollama`;
  const running = ollamaRunning ?? false;
  const paidProviders = PROVIDERS.filter((p) => p.tier === "paid");
  const freeProviders = PROVIDERS.filter((p) => p.tier === "free");

  const renderProvider = (p: AIProvider) => {
    const activeProvider = selection.source === "remote" && selection.providerId === p.id;
    const key = apiKeys[p.id] ?? "";
    const hasEnv = envReady[p.id] ?? false;
    return (
      <div key={p.id} className="py-0.5">
        <div className="flex items-center justify-between gap-2 px-3 pt-2">
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
        {activeProvider &&
          (p.envKey && hasEnv ? (
            <p className="mx-3 mb-2 text-[11px] text-dim-gray">
              Authenticated server-side via the {p.envKey} environment variable — no key
              needed here.
            </p>
          ) : (
            <input
              type="password"
              value={key}
              onChange={(e) => onKeyChange(p.id, e.target.value)}
              placeholder="Paste API key (stored in your browser)"
              className="mx-3 mb-1 w-[calc(100%-24px)] rounded-inputs border border-linen-border bg-white px-3 py-2 text-[12px] text-charcoal outline-none placeholder:text-dim-gray/60 focus:border-stone"
            />
          ))}
        {p.models.map((m) => (
          <ModelButton
            key={m.id}
            active={activeProvider && selection.model === m.id}
            title={m.label}
            sub={modelTier(p, m.id)}
            onClick={() => onSelect({ source: "remote", providerId: p.id, model: m.id })}
          />
        ))}
      </div>
    );
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-buttons border border-linen-border bg-white px-3 py-1.5 text-[13px] text-charcoal transition-colors hover:border-stone"
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            running && selection.source === "ollama" ? "bg-charcoal" : "bg-stone"
          }`}
        />
        {label}
        <Caret />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 max-h-[70vh] w-[340px] overflow-y-auto rounded-3xl border border-linen-border bg-parchment p-2 shadow-subtle-2">
          <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-dim-gray">
            Ollama (local)
          </p>

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
              Ollama is not running — start it with{" "}
              <code className="text-charcoal">ollama serve</code>{" "}
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
              onClick={() => onSelect({ source: "ollama", model: name })}
            />
          ))}
          {OLLAMA_MODELS.filter((m) => !ollamaModels.includes(m.id)).map((m) => (
            <ModelButton
              key={m.id}
              active={selection.source === "ollama" && selection.model === m.id}
              title={`${m.tag}  \u00b7  ${m.size}`}
              sub="ollama pull"
              onClick={() => onSelect({ source: "ollama", model: m.id })}
            />
          ))}
          {ollamaRunning && ollamaModels.length === 0 && (
            <p className="px-3 pb-2 pt-1 text-[12px] text-dim-gray">
              Then pick one — these are free &amp; private.
            </p>
          )}

          <p className="border-t border-linen-border px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-dim-gray">
            Flagship models
          </p>

          {paidProviders.map(renderProvider)}

          <p className="border-t border-linen-border px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-dim-gray">
            Free APIs
          </p>

          {freeProviders.map(renderProvider)}

          <p className="border-t border-linen-border px-3 pb-1 pt-3 text-[11px] text-dim-gray">
            Paid flagships need their own API key (or a server env var — green “ready”
            means it&apos;s configured). Free models from the{" "}
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
        </div>
      )}
    </div>
  );
}
