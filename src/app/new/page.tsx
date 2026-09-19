"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LovableLogo, LovableMark } from "@/components/brand";
import ModelPicker from "@/components/chat/model-picker";
import { getProvider, type ModelSelection } from "@/lib/models";

const suggestions = [
  "Build me a landing page for my new SaaS product",
  "Create a booking app for my yoga studio",
  "Make a kanban task tracker with drag and drop",
  "Prototype an AI chat widget for my website",
];

type Message = {
  role: "user" | "assistant";
  content: string;
};

const STORAGE_MODEL = "lovable.model";
const STORAGE_KEYS = "lovable.keys";

function loadSelection(): ModelSelection {
  try {
    const raw = localStorage.getItem(STORAGE_MODEL);
    if (raw) {
      const parsed = JSON.parse(raw) as ModelSelection;
      if (parsed && typeof parsed.model === "string") return parsed;
    }
  } catch {}
  return { source: "ollama", model: "qwen3.8:latest" };
}

function loadKeys(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS);
    if (raw) return JSON.parse(raw) as Record<string, string>;
  } catch {}
  return {};
}

function shortName(model: string) {
  return model.split(":")[0];
}

function NewChatInner() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => {
    const q = searchParams.get("q");
    return q ? [{ role: "user", content: q }] : [];
  });
  const [thinking, setThinking] = useState(false);
  const [selection, setSelection] = useState<ModelSelection>({
    source: "ollama",
    model: "qwen3.8:latest",
  });
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [ollama, setOllama] = useState<{
    running?: boolean;
    models: string[];
  }>({ models: [] });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const s = loadSelection();
      if (s) setSelection(s);
      setApiKeys(loadKeys());
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MODEL, JSON.stringify(selection));
    } catch {}
  }, [selection]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS, JSON.stringify(apiKeys));
    } catch {}
  }, [apiKeys]);

  useEffect(() => {
    fetch("/api/models")
      .then((r) => r.json())
      .then((d) => setOllama({ running: d.running, models: d.models ?? [] }))
      .catch(() => setOllama({ running: false, models: [] }));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || thinking) return;
      setInput("");
      const updated: Message[] = [...messages, { role: "user", content }];
      setMessages(updated);
      setThinking(true);
      try {
        const provider =
          selection.source === "remote" ? getProvider(selection.providerId) : undefined;
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: selection.source,
            providerId: selection.providerId,
            baseUrl: provider?.baseUrl,
            apiKey: provider ? apiKeys[provider.id] : undefined,
            model: selection.model,
            messages: updated,
          }),
        });
        const data = await res.json();
        const reply = (data.content as string) ?? (data.error ? `Error: ${data.error}` : "No reply");
        setMessages((m) => [...m, { role: "assistant", content: reply }]);
      } catch {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Error: could not reach the model backend." },
        ]);
      } finally {
        setThinking(false);
      }
    },
    [input, thinking, messages, selection, apiKeys],
  );

  const isNew = messages.length === 0;
  const provider = selection.source === "remote" ? getProvider(selection.providerId) : undefined;
  const sourceLabel = provider ? provider.name : "Ollama";
  const activeLabel = `${shortName(selection.model)} \u00b7 ${sourceLabel}`;
  const ollamaRunning = ollama.running;

  return (
    <div className="flex min-h-screen bg-parchment text-charcoal">
      {/* ===== Sidebar ===== */}
      <aside className="hidden w-[268px] shrink-0 flex-col border-r border-linen-border bg-warm-sand md:flex">
        <div className="px-4 py-4">
          <LovableLogo className="text-charcoal" />
        </div>
        <div className="px-3">
          <button
            onClick={() => {
              setMessages([]);
              setInput("");
            }}
            className="flex w-full items-center gap-2 rounded-buttons border border-linen-border bg-white px-3 py-2.5 text-[13px] text-charcoal transition-colors hover:border-stone"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path
                d="M12 4v16m8-8H4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Start new chat
          </button>
        </div>
        <div className="mt-8 flex-1 overflow-y-auto px-3">
          <p className="px-1 text-[11px] uppercase tracking-[0.06em] text-dim-gray">
            Today
          </p>
          <div className="mt-2 space-y-0.5 text-[13px] text-dim-gray">
            {messages.length > 0 && (
              <div className="truncate rounded-buttons bg-white px-2 py-1.5 text-charcoal">
                {messages[0].content.slice(0, 40)}
                {messages[0].content.length > 40 ? "…" : ""}
              </div>
            )}
            <div className="px-2 py-1.5 text-dim-gray/70">
              No chats yet — start a new one
            </div>
          </div>
        </div>
        <div className="border-t border-linen-border px-3 py-4">
          <div className="flex items-center gap-2 text-[13px] text-dim-gray">
            <span
              className={`h-2 w-2 rounded-full ${
                selection.source === "remote"
                  ? "bg-[#4B73FF]"
                  : ollamaRunning
                    ? "bg-charcoal"
                    : "bg-stone"
              }`}
            />
            <span className="truncate">
              {shortName(selection.model)} · {sourceLabel}
            </span>
          </div>
        </div>
      </aside>

      {/* ===== Main ===== */}
      <div className="flex flex-1 flex-col">
        {isNew ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white shadow-subtle">
                <LovableMark className="h-7 w-7" />
              </div>
            </div>
            <h1 className="mt-8 text-center text-[clamp(32px,5vw,48px)] font-w480 leading-[1.1] tracking-[-1.2px] text-charcoal">
              What do you want to build today?
            </h1>
            <p className="mt-3 text-body text-dim-gray">{activeLabel} is ready.</p>
            <div className="mt-10 grid w-full max-w-[680px] grid-cols-1 gap-3 sm:grid-cols-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-3xl border border-linen-border bg-white p-4 text-left text-[14px] leading-[1.4] text-charcoal transition-colors hover:border-stone"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl px-6 py-8">
              <div className="space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className="flex gap-4">
                    {msg.role === "assistant" && (
                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center">
                        <LovableMark className="h-5 w-5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-3xl px-4 py-3 text-[15px] leading-[1.6] text-pretty ${
                        msg.role === "user"
                          ? "ml-auto rounded-br-md bg-warm-sand text-charcoal"
                          : "border border-linen-border bg-white text-charcoal"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex gap-4">
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center">
                      <LovableMark className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-3xl border border-linen-border bg-white px-4 py-3">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-stone" />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-stone"
                        style={{ animationDelay: "0.15s" }}
                      />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-stone"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </div>
          </div>
        )}

        {/* ===== Composer ===== */}
        <div className="border-t border-linen-border px-4 pb-4 pt-3">
          <div className="mx-auto mb-2 flex max-w-3xl items-center justify-between gap-2 px-1">
            <ModelPicker
              selection={selection}
              apiKeys={apiKeys}
              ollamaRunning={ollamaRunning}
              ollamaModels={ollama.models}
              onSelect={setSelection}
              onKeyChange={(id, key) =>
                setApiKeys((k) => ({ ...k, [id]: key }))
              }
            />
            <span className="hidden text-[11px] text-dim-gray sm:block">
              Free models via Ollama + Free-LLM directory
            </span>
          </div>
          <form
            className="mx-auto flex max-w-3xl items-end gap-2 rounded-3xl border border-linen-border bg-warm-sand p-2 pl-5 shadow-subtle-2 focus-within:border-stone"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you want to build..."
              aria-label="Message"
              className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent py-2.5 text-[15px] leading-[1.5] text-charcoal outline-none placeholder:text-dim-gray"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={!input.trim() || thinking}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hero-gradient-btn text-white transition-transform hover:scale-105 disabled:opacity-40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14m0 0l-6-6m6 6l-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
          <p className="mx-auto mt-2 max-w-3xl text-[11px] text-dim-gray">
            Free models can make mistakes. Your API keys never leave this browser.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function NewChat() {
  return (
    <Suspense fallback={null}>
      <NewChatInner />
    </Suspense>
  );
}