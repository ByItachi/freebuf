import { cookies } from "next/headers";
import { randomUUID } from "crypto";

/**
 * Admin gate. Password comes from ADMIN_PASSWORD (or ADMIN_PASSWORD_FILE for
 * hosted secrets). When unset, a per-deploy random password is generated and
 * printed once to the server console — so the panel is never wide open.
 */
const COOKIE_NAME = "crowl_admin";

async function expectedPassword(): Promise<string> {
  const fromFile = process.env.ADMIN_PASSWORD_FILE;
  if (fromFile) {
    try {
      const { readFile } = await import("fs/promises");
      const v = (await readFile(fromFile, "utf8")).trim();
      if (v) return v;
    } catch {}
  }
  const fromEnv = process.env.ADMIN_PASSWORD?.trim();
  if (fromEnv) return fromEnv;
  // Fallback: random per-process password, announced once in the server logs.
  const g = globalThis as unknown as { __crowlAdminPw?: string };
  if (!g.__crowlAdminPw) {
    g.__crowlAdminPw = randomUUID().replace(/-/g, "").slice(0, 12);
    console.log(
      `\n[crowl] ADMIN_PASSWORD not set — temporary admin password: ${g.__crowlAdminPw}\n` +
        `[crowl] Set ADMIN_PASSWORD in your environment to lock this down.\n`,
    );
  }
  return g.__crowlAdminPw;
}

/** True when the request carries a valid admin session cookie. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === (await sessionValue());
}

async function sessionValue(): Promise<string> {
  const pw = await expectedPassword();
  return `ok-${Buffer.from(pw).toString("base64url")}`;
}

/** Verify a login attempt; on success, issue the httpOnly session cookie. */
export async function loginAdmin(password: string): Promise<boolean> {
  if (!password || password !== (await expectedPassword())) return false;
  const store = await cookies();
  store.set(COOKIE_NAME, await sessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return true;
}

export async function logoutAdmin(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Guard for admin API routes — returns a 401 response when not authorized. */
export async function requireAdmin(): Promise<Response | null> {
  if (await isAdmin()) return null;
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
