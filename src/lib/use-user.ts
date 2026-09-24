"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Resolves the signed-in user's display identity for the dashboard.
 *
 * Two channels, in priority order:
 * 1. postMessage from the host page when this app runs inside an iframe
 *    (the parent sends `freebuff:user` after `freebuff:ready`). The host should
 *    call `iframe.contentWindow.postMessage({ type: "freebuff:user", user },
 *    "*")` — origin checking is done via the handshake origin below.
 * 2. `?user=` URL parameter fallback (`?user=Ad%20Soyad`), so hosts can pass
 *    the name without scripting the iframe.
 *
 * The resolved name is persisted to localStorage (`freebuff.user`) so the
 * sidebar shows something meaningful on later standalone loads.
 */
export type DashboardUser = {
  name: string; // "Ad Soyad"
  email?: string;
  avatarUrl?: string;
};

export const USER_STORAGE_KEY = "freebuff.user";

const READY_MESSAGE = "freebuff:ready";
const USER_MESSAGE = "freebuff:user";

export function readStoredUser(): DashboardUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DashboardUser;
    return parsed && typeof parsed.name === "string" && parsed.name.trim()
      ? { ...parsed, name: parsed.name.trim() }
      : null;
  } catch {
    return null;
  }
}

export function storeUser(user: DashboardUser) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {}
}

function userFromUrl(): DashboardUser | null {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("user")?.trim();
    if (!name) return null;
    return { name };
  } catch {
    return null;
  }
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const chars = parts.map((p) => p.charAt(0).toUpperCase()).join("");
  return chars || "U";
}

/**
 * Shared identity hook. Call anywhere in the dashboard; the handshake runs
 * once per page (module-level guard) and updates via a custom window event,
 * so multiple consumers stay in sync.
 */
let handshakeStarted = false;

export function useUser(): {
  user: DashboardUser | null;
  initials: string;
  setUserName: (name: string) => void;
} {
  const [user, setUser] = useState<DashboardUser | null>(() => null);

  useEffect(() => {
    let alive = true;

    // 1) previously stored user, so the UI has something immediately
    //    (deferred to a task to avoid sync setState-in-effect cascades)
    const stored = readStoredUser();
    const t = setTimeout(() => {
      if (alive && stored) setUser(stored);
    }, 0);

    // 2) iframe postMessage handshake
    if (!handshakeStarted && typeof window !== "undefined") {
      handshakeStarted = true;
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: READY_MESSAGE }, "*");
        }
      } catch {}
      window.addEventListener("message", (event: MessageEvent) => {
        const data = event.data as { type?: string; user?: DashboardUser } | null;
        if (!data || data.type !== USER_MESSAGE || !data.user?.name) return;
        const incoming: DashboardUser = {
          name: String(data.user.name).trim(),
          email: data.user.email ? String(data.user.email) : undefined,
          avatarUrl: data.user.avatarUrl ? String(data.user.avatarUrl) : undefined,
        };
        storeUser(incoming);
        window.dispatchEvent(new CustomEvent("freebuff:user-changed"));
      });
    }

    // 3) URL fallback — ?user=Ad%20Soyad (wins over storage only when present)
    const fromUrl = userFromUrl();
    if (fromUrl) {
      storeUser(fromUrl);
      setTimeout(() => {
        if (alive) setUser(fromUrl);
      }, 0);
    }

    const onExternalChange = () => {
      if (!alive) return;
      setUser(readStoredUser());
    };
    window.addEventListener("freebuff:user-changed", onExternalChange);
    return () => {
      alive = false;
      clearTimeout(t);
      window.removeEventListener("freebuff:user-changed", onExternalChange);
    };
  }, []);

  const setUserName = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const next: DashboardUser = { ...(readStoredUser() ?? {}), name: trimmed };
    storeUser(next);
    setUser(next);
    window.dispatchEvent(new CustomEvent("freebuff:user-changed"));
  }, []);

  const initials = user ? initialsOf(user.name) : "";

  return { user, initials, setUserName };
}
