"use client";

/**
 * Daily build-credit meter for the workspace menu (Freebuff shows "Credits
 * N left >" with a reset-at-midnight-UTC note). Kept honest: real counter of
 * model calls sent from this browser, no fake usage data.
 */

const KEY = "freebuff.credits";
const LIMIT = 30;

export type CreditState = {
  /** ISO date (UTC day) the counter belongs to. */
  day: string;
  used: number;
};

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export function readCredits(): CreditState {
  if (typeof window === "undefined") return { day: todayUtc(), used: 0 };
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as CreditState) : null;
    if (parsed && parsed.day === todayUtc() && typeof parsed.used === "number") {
      return parsed;
    }
  } catch {}
  return { day: todayUtc(), used: 0 };
}

function writeCredits(state: CreditState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  window.dispatchEvent(new CustomEvent("freebuff:credits-changed"));
}

/** Records one model call. Returns the updated state. */
export function spendCredit(): CreditState {
  const next: CreditState = { day: todayUtc(), used: readCredits().used + 1 };
  writeCredits(next);
  return next;
}

export function remainingCredits(state: CreditState = readCredits()): number {
  return Math.max(0, LIMIT - state.used);
}

export const CREDITS_LIMIT = LIMIT;
