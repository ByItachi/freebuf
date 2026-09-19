"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUp,
  Loader2,
  PanelRightOpen,
  RefreshCw,
  Sparkles,
  Star,
} from "lucide-react";
import { recordProjectView, unhideProjectFromRecents } from "@/lib/recents";
function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type Msg = { role: "user" | "assistant"; content: string };
type Project = {
  id: string;
  name: string;
  prompt: string;
  starred: boolean;
  messages: Msg[];
  previewHtml: string;
  updatedAt: string;
};

export default function ProjectWorkspacePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setProject(data.project);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const t = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(t);
  }, [load]);

  // track the view for dashboard "Recently viewed" / "Most visited today";
  // re-opening a project un-hides it from recents.
  useEffect(() => {
    if (!id) return;
    unhideProjectFromRecents(id);
    recordProjectView(id);
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [project?.messages, busy]);

  const bootstrap = useMemo(() => {
    if (!project) return false;
    return project.messages.length === 1 && project.messages[0]?.role === "user";
  }, [project]);

  const runChat = useCallback(
    async (seed?: string) => {
      if (!project || busy) return;
      const text = (seed ?? input).trim();
      if (!text) return;
      setInput("");
      setBusy(true);
      setError(null);

      const nextMessages: Msg[] = [...project.messages, { role: "user", content: text }];
      // if seed already last user message (bootstrap), don't duplicate
      const messages =
        seed &&
        project.messages.length === 1 &&
        project.messages[0].role === "user" &&
        project.messages[0].content === seed
          ? project.messages
          : nextMessages;

      setProject({ ...project, messages });

      try {
        const keysRaw = localStorage.getItem("lovable.keys");
        const keys = keysRaw ? (JSON.parse(keysRaw) as Record<string, string>) : {};
        const modelRaw = localStorage.getItem("lovable.model");
        let selection: { source: string; providerId?: string; model: string } = {
          source: "demo",
          model: "manus-builder",
        };
        try {
          if (modelRaw) selection = JSON.parse(modelRaw);
        } catch {}

        let source = selection.source === "ollama" ? "ollama" : selection.source === "remote" ? "remote" : "demo";
        // Prefer remote if key present; else demo
        if (source === "remote") {
          const providerId = selection.providerId;
          const hasKey = providerId ? Boolean(keys[providerId]) : false;
          if (!hasKey) source = "demo";
        }

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source,
            providerId: selection.providerId,
            apiKey: selection.providerId ? keys[selection.providerId] : undefined,
            model: source === "demo" ? "manus-builder" : selection.model,
            messages,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          // soft-fallback to demo
          const demo = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ source: "demo", model: "manus-builder", messages }),
          }).then((r) => r.json());
          const content = demo.content || data.error || "No reply";
          const previewHtml = demo.previewHtml || project.previewHtml;
          const updatedMsgs = [...messages, { role: "assistant" as const, content }];
          const patch = await fetch(`/api/projects/${project.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: updatedMsgs, previewHtml }),
          }).then((r) => r.json());
          setProject(patch.project);
        } else {
          const content = data.content as string;
          const previewHtml = (data.previewHtml as string) || project.previewHtml;
          const updatedMsgs = [...messages, { role: "assistant" as const, content }];
          const patch = await fetch(`/api/projects/${project.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: updatedMsgs, previewHtml }),
          }).then((r) => r.json());
          setProject(patch.project);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Chat failed");
      } finally {
        setBusy(false);
      }
    },
    [project, busy, input],
  );

  useEffect(() => {
    if (!project || busy || !bootstrap) return;
    const t = setTimeout(() => {
      void runChat(project.messages[0].content);
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootstrap, project?.id]);

  async function toggleStar() {
    if (!project) return;
    const res = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ starred: !project.starred }),
    });
    const data = await res.json();
    if (data.project) setProject(data.project);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment text-dim-gray">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-parchment">
        <p className="text-charcoal">Project not found</p>
        <Link href="/dashboard" className="text-sm text-dim-gray underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-parchment text-charcoal">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-linen-border px-4">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="flex size-9 items-center justify-center rounded-full hover:bg-black/[0.04]"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-medium tracking-tight">{project.name}</h1>
          <p className="truncate text-[12px] text-dim-gray">AI builder workspace</p>
        </div>
        <button
          type="button"
          onClick={() => void toggleStar()}
          className="flex size-9 items-center justify-center rounded-full hover:bg-black/[0.04]"
          aria-label="Star"
        >
          <Star className={cn("size-4", project.starred && "fill-amber-400 text-amber-400")} />
        </button>
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className="hidden items-center gap-1.5 rounded-full border border-linen-border px-3 py-1.5 text-[13px] md:inline-flex"
        >
          <PanelRightOpen className="size-3.5" />
          Preview
        </button>
        <button
          type="button"
          onClick={() => void load()}
          className="flex size-9 items-center justify-center rounded-full hover:bg-black/[0.04]"
          aria-label="Refresh"
        >
          <RefreshCw className="size-4" />
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        <section className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mx-auto flex max-w-2xl flex-col gap-4">
              {project.messages.map((m, i) => (
                <div
                  key={`${i}-${m.role}`}
                  className={cn(
                    "rounded-3xl px-4 py-3 text-[14px] leading-relaxed tracking-tight whitespace-pre-wrap",
                    m.role === "user"
                      ? "ml-8 bg-warm-sand text-charcoal"
                      : "mr-4 border border-linen-border bg-white text-charcoal",
                  )}
                >
                  {m.role === "assistant" ? (
                    <div className="mb-2 inline-flex items-center gap-1.5 text-[12px] font-medium text-dim-gray">
                      <Sparkles className="size-3.5" /> Manus AI
                    </div>
                  ) : null}
                  {m.content}
                </div>
              ))}
              {busy ? (
                <div className="mr-4 inline-flex items-center gap-2 rounded-3xl border border-linen-border bg-white px-4 py-3 text-[13px] text-dim-gray">
                  <Loader2 className="size-4 animate-spin" /> Building…
                </div>
              ) : null}
              {error ? <p className="text-[13px] text-red-600">{error}</p> : null}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="border-t border-linen-border p-4">
            <form
              className="mx-auto flex max-w-2xl items-end gap-2 rounded-[24px] bg-warm-sand p-3 shadow-[inset_0_0_0_0.5px_rgba(28,28,28,0.08)]"
              onSubmit={(e) => {
                e.preventDefault();
                void runChat();
              }}
            >
              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI to change the UI, add a section, connect data…"
                className="max-h-40 min-h-[48px] flex-1 resize-none bg-transparent px-2 py-2 text-[14px] outline-none placeholder:text-dim-gray"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void runChat();
                  }
                }}
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="flex size-10 items-center justify-center rounded-full bg-[rgba(0,0,0,0.88)] text-parchment disabled:opacity-40"
                aria-label="Send"
              >
                <ArrowUp className="size-4" />
              </button>
            </form>
          </div>
        </section>

        {showPreview ? (
          <aside className="hidden w-[46%] min-w-[320px] border-l border-linen-border bg-white lg:flex lg:flex-col">
            <div className="flex h-10 items-center justify-between border-b border-linen-border px-3 text-[12px] text-dim-gray">
              <span>Live preview</span>
              <span className="rounded-full bg-black/[0.04] px-2 py-0.5">HTML</span>
            </div>
            <iframe
              title="preview"
              className="h-full w-full flex-1 bg-parchment"
              srcDoc={project.previewHtml}
              sandbox="allow-scripts"
            />
          </aside>
        ) : null}
      </div>
    </div>
  );
}