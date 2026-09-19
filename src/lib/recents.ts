"use client";

// Local project-view tracking powering "Recently viewed" / "Most visited
// today" tabs. Persisted in localStorage — no server round-trip needed.

const KEY = "lovable.views";

export type ViewEntry = { count: number; last: string };

type ViewMap = Record<string, ViewEntry>;

function read(): ViewMap {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as ViewMap;
  } catch {}
  return {};
}

function write(map: ViewMap) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {}
}

export function recordProjectView(id: string) {
  if (typeof window === "undefined" || !id) return;
  const map = read();
  const prev = map[id];
  map[id] = {
    count: (prev?.count ?? 0) + 1,
    last: new Date().toISOString(),
  };
  write(map);
}

/** Ids ordered by most recent view, minus ones hidden via "Hide from recents". */
export function recentProjectIds(limit = 12): string[] {
  if (typeof window === "undefined") return [];
  const map = read();
  return Object.entries(map)
    .filter(([id]) => !isProjectHidden(id))
    .sort((a, b) => b[1].last.localeCompare(a[1].last))
    .slice(0, limit)
    .map(([id]) => id);
}

/** Hidden ids ("Hide from recents") — excluded from fallback lists too. */
const HIDDEN_KEY = "lovable.views.hidden";

export function isProjectHidden(id: string): boolean {
  if (typeof window === "undefined" || !id) return false;
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    const arr: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) && arr.includes(id);
  } catch {
    return false;
  }
}

export function hideProjectFromRecents(id: string) {
  if (typeof window === "undefined" || !id) return;
  removeProjectView(id);
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    const arr: unknown = raw ? JSON.parse(raw) : [];
    const next = Array.isArray(arr) ? arr.filter((x) => x !== id) : [];
    next.unshift(id);
    localStorage.setItem(HIDDEN_KEY, JSON.stringify(next.slice(0, 100)));
  } catch {}
}

export function unhideProjectFromRecents(id: string) {
  if (typeof window === "undefined" || !id) return;
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    const arr: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) return;
    localStorage.setItem(HIDDEN_KEY, JSON.stringify(arr.filter((x) => x !== id)));
  } catch {}
}

/** Ids viewed today (hidden excluded), ordered by visit count. */
export function visitedTodayIds(): string[] {
  if (typeof window === "undefined") return [];
  const map = read();
  const today = new Date().toDateString();
  return Object.entries(map)
    .filter(([id, v]) => new Date(v.last).toDateString() === today && !isProjectHidden(id))
    .sort((a, b) => b[1].count - a[1].count)
    .map(([id]) => id);
}

/** Removes one project from the local view history ("Hide from recents"). */
export function removeProjectView(id: string) {
  if (typeof window === "undefined" || !id) return;
  const map = read();
  delete map[id];
  write(map);
}
