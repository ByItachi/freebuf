import { randomUUID } from "crypto";
import type { PlatformContext, Result } from "../types";

export type Session = {
  id: string;
  userId: string;
  tenantId: string;
  workspaceId: string;
  roles: string[];
  mfa: boolean;
  createdAt: string;
  expiresAt: string;
};

const sessions = new Map<string, Session>();
const users = new Map<string, { id: string; email: string; name: string; orgId: string }>([
  ["user-local", { id: "user-local", email: "builder@manus.local", name: "Local Builder", orgId: "org-manus" }],
]);

export const identity = {
  async login(email: string): Promise<Result<Session>> {
    const user = [...users.values()].find((u) => u.email === email) ?? {
      id: randomUUID(),
      email,
      name: email.split("@")[0] || "User",
      orgId: "org-manus",
    };
    users.set(user.id, user);
    const now = Date.now();
    const session: Session = {
      id: randomUUID(),
      userId: user.id,
      tenantId: "tenant-default",
      workspaceId: "ws-default",
      roles: ["owner", "builder"],
      mfa: false,
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + 1000 * 60 * 60 * 12).toISOString(),
    };
    sessions.set(session.id, session);
    return { ok: true, data: session };
  },
  async authorize(ctx: PlatformContext, action: string, resource: string): Promise<Result<boolean>> {
    const allowed = ctx.roles.includes("owner") || ctx.roles.includes("admin") || ctx.roles.includes("builder");
    if (!allowed) return { ok: false, error: `Denied ${action} on ${resource}`, code: "FORBIDDEN" };
    return { ok: true, data: true };
  },
  getSession(id: string) {
    return sessions.get(id) ?? null;
  },
  listUsers() {
    return [...users.values()];
  },
};