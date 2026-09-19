"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  ArrowLeftRight,
  Copy,
  ExternalLink,
  EyeOff,
  Settings,
  Star,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hideProjectFromRecents, unhideProjectFromRecents } from "@/lib/recents";

export type ProjectActionsTarget = {
  id: string;
  name: string;
  starred: boolean;
  published?: boolean;
};

type Props = {
  project: ProjectActionsTarget;
  onChanged?: () => void;
  align?: "left" | "right";
};

const MENU_W = 208; // w-52
const MENU_H_ESTIMATE = 360;

/**
 * Three-dot "…" button opening a Lovable-style project menu:
 * Open in new tab · Star · Remix │ Copy link · Hide from recents ·
 * Settings · Publish/Unpublish │ Delete.
 *
 * The menu renders in a portal on <body> so it can safely live inside
 * Link cards (no nested <a> hydration errors) and never gets clipped.
 */
export function ProjectActionsMenu({ project, onChanged, align = "right" }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Portal host exists on the client; open can only become true after a
  // user interaction, so this is hydration-safe without a mounted flag.
  const portalHost = typeof document !== "undefined" ? document.body : null;

  const place = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const left =
      align === "right"
        ? Math.max(8, Math.min(r.right - MENU_W, window.innerWidth - MENU_W - 8))
        : Math.max(8, Math.min(r.left, window.innerWidth - MENU_W - 8));
    const openUp = r.bottom + MENU_H_ESTIMATE > window.innerHeight && r.top > MENU_H_ESTIMATE;
    setPos({ top: openUp ? r.top - MENU_H_ESTIMATE - 4 : r.bottom + 4, left });
  }, [align]);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
      setConfirmDelete(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setConfirmDelete(false);
      }
    }
    function onScroll() {
      setOpen(false);
      setConfirmDelete(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open]);

  function toggleOpen(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!open) place();
    setOpen((v) => !v);
    setConfirmDelete(false);
  }

  async function patch(body: Record<string, unknown>) {
    if (busy) return;
    setBusy(true);
    try {
      await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setOpen(false);
      onChanged?.();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (busy) return;
    setBusy(true);
    try {
      await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      setOpen(false);
      onChanged?.();
    } finally {
      setBusy(false);
    }
  }

  const itemCls =
    "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[13px] text-charcoal hover:bg-black/[0.04] text-left disabled:opacity-50";
  const dangerCls =
    "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 text-left disabled:opacity-50";

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={`Options for ${project.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggleOpen}
        className="flex size-7 shrink-0 items-center justify-center rounded-full text-dim-gray transition-colors hover:bg-black/[0.06] hover:text-charcoal"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="19" cy="12" r="1.6" />
        </svg>
      </button>

      {portalHost && open && pos
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              style={{ position: "fixed", top: pos.top, left: pos.left, width: MENU_W }}
              className="z-[100] rounded-2xl border border-linen-border bg-parchment p-1.5 shadow-lg"
            >
              <button
                type="button"
                onClick={() => {
                  window.open(`/projects/${project.id}`, "_blank");
                  setOpen(false);
                }}
                className={itemCls}
              >
                <ExternalLink className="size-3.5" /> Open in new tab
              </button>

              <button type="button" onClick={() => void patch({ starred: !project.starred })} disabled={busy} className={itemCls}>
                <Star className={cn("size-3.5", project.starred && "fill-amber-400 text-amber-400")} />
                {project.starred ? "Unstar" : "Star"}
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (busy) return;
                  setBusy(true);
                  try {
                    const res = await fetch(`/api/projects?from=${project.id}`, {
                      method: "POST",
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || "remix failed");
                    setOpen(false);
                    onChanged?.();
                    router.push(`/projects/${data.project.id}`);
                  } catch {
                    setBusy(false);
                  }
                }}
                disabled={busy}
                className={itemCls}
              >
                <ArrowLeftRight className="size-3.5" /> Remix
              </button>

              {project.published ? (
                <>
                  <div className="my-1.5 h-px bg-linen-border" />
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard
                        ?.writeText(`${window.location.origin}/projects/${project.id}`)
                        .catch(() => {});
                      setOpen(false);
                    }}
                    className={itemCls}
                  >
                    <Copy className="size-3.5" /> Copy link
                  </button>
                </>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  hideProjectFromRecents(project.id);
                  setOpen(false);
                  onChanged?.();
                }}
                className={itemCls}
              >
                <EyeOff className="size-3.5" /> Hide from recents
              </button>

              <div className="my-1.5 h-px bg-linen-border" />

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  router.push("/dashboard/settings");
                }}
                className={itemCls}
              >
                <Settings className="size-3.5" /> Settings
              </button>

              <button
                type="button"
                onClick={() => {
                  unhideProjectFromRecents(project.id);
                  void patch({ published: !project.published });
                }}
                disabled={busy}
                className={itemCls}
              >
                <EyeOff className="size-3.5" />
                {project.published ? "Unpublish" : "Publish"}
              </button>

              <div className="my-1.5 h-px bg-linen-border" />

              {confirmDelete ? (
                <div className="rounded-xl bg-red-50 px-3 py-2">
                  <p className="text-[12px] font-medium text-red-700">Delete “{project.name}”?</p>
                  <div className="mt-1.5 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => void remove()}
                      disabled={busy}
                      className="flex-1 rounded-full bg-red-600 px-2 py-1 text-[12px] font-medium text-white disabled:opacity-50"
                    >
                      {busy ? "Deleting…" : "Delete"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 rounded-full border border-linen-border bg-parchment px-2 py-1 text-[12px] text-charcoal"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className={dangerCls}>
                  <Trash2 className="size-3.5" /> Delete
                </button>
              )}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export default ProjectActionsMenu;
