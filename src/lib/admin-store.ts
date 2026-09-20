import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

/**
 * Admin control-plane store. Single JSON file under .data/ (gitignored) so the
 * panel can manage members, billing, connectors and AI settings on any Node
 * host without extra infra. Swap for a real DB later — all access goes through
 * these helpers.
 */

export type MemberRole = "owner" | "admin" | "member";
export type MemberStatus = "active" | "suspended";
export type MemberPlan = "free" | "pro" | "enterprise";

export type Member = {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  plan: MemberPlan;
  credits: number;
  createdAt: string;
  lastSeenAt: string;
};

export type Invoice = {
  id: string;
  number: string;
  memberId: string;
  amount: number; // USD
  status: "paid" | "open" | "void";
  description: string;
  createdAt: string;
};

export type PaymentMethod = {
  id: string;
  memberId: string;
  brand: "visa" | "mastercard" | "amex";
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  createdAt: string;
};

export type AIConfig = {
  defaultProviderId: string | null;
  demoFallback: boolean;
  allowOllama: boolean;
  maxTokens: number;
  updatedAt: string;
};

export type ConnectorState = {
  /** Platform-wide switch controlled from /admin/connectors. */
  enabled: boolean;
  /** Workspace-level "connected" flag (was localStorage before). */
  connected: boolean;
};

type AdminDB = {
  members: Member[];
  invoices: Invoice[];
  paymentMethods: PaymentMethod[];
  connectors: Record<string, ConnectorState>;
  ai: AIConfig;
  /** Provider API keys pasted from the admin panel. Never returned to clients. */
  providerKeys: Record<string, string>;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_PATH = path.join(DATA_DIR, "admin.json");

/** Canonical connector catalog (mirrors /dashboard/connectors). */
export const CONNECTOR_CATALOG: { id: string; name: string; description: string }[] = [
  { id: "github", name: "GitHub", description: "Import repos and sync commits" },
  { id: "supabase", name: "Supabase", description: "Auth, database, and storage" },
  { id: "stripe", name: "Stripe", description: "Payments and subscriptions" },
  { id: "notion", name: "Notion", description: "Docs and knowledge sync" },
  { id: "slack", name: "Slack", description: "Notifications and commands" },
  { id: "figma", name: "Figma", description: "Design tokens and assets" },
];

function seed(): AdminDB {
  const now = Date.now();
  const iso = (msAgo: number) => new Date(now - msAgo).toISOString();
  const days = (n: number) => n * 24 * 60 * 60 * 1000;

  const members: Member[] = [
    {
      id: randomUUID(),
      name: "Gürkan Akbaba",
      email: "mylife12.gra@gmail.com",
      role: "owner",
      status: "active",
      plan: "pro",
      credits: 1500,
      createdAt: iso(days(240)),
      lastSeenAt: iso(1000 * 60 * 4),
    },
    {
      id: randomUUID(),
      name: "Ayşe Demir",
      email: "ayse.demir@example.com",
      role: "admin",
      status: "active",
      plan: "pro",
      credits: 640,
      createdAt: iso(days(120)),
      lastSeenAt: iso(days(1)),
    },
    {
      id: randomUUID(),
      name: "Mert Kaya",
      email: "mert.kaya@example.com",
      role: "member",
      status: "active",
      plan: "free",
      credits: 40,
      createdAt: iso(days(30)),
      lastSeenAt: iso(days(3)),
    },
    {
      id: randomUUID(),
      name: "Elif Yıldız",
      email: "elif.yildiz@example.com",
      role: "member",
      status: "suspended",
      plan: "free",
      credits: 5,
      createdAt: iso(days(12)),
      lastSeenAt: iso(days(8)),
    },
  ];

  const invoices: Invoice[] = [
    { id: randomUUID(), number: "INV-2026-0041", memberId: members[0].id, amount: 25, status: "paid", description: "Pro plan — monthly", createdAt: iso(days(2)) },
    { id: randomUUID(), number: "INV-2026-0040", memberId: members[1].id, amount: 25, status: "paid", description: "Pro plan — monthly", createdAt: iso(days(9)) },
    { id: randomUUID(), number: "INV-2026-0039", memberId: members[0].id, amount: 120, status: "paid", description: "Enterprise credits pack", createdAt: iso(days(16)) },
    { id: randomUUID(), number: "INV-2026-0038", memberId: members[2].id, amount: 25, status: "open", description: "Pro plan — monthly", createdAt: iso(days(4)) },
    { id: randomUUID(), number: "INV-2026-0037", memberId: members[1].id, amount: 25, status: "paid", description: "Pro plan — monthly", createdAt: iso(days(39)) },
    { id: randomUUID(), number: "INV-2026-0036", memberId: members[3].id, amount: 10, status: "void", description: "Credits top-up (refunded)", createdAt: iso(days(45)) },
  ];

  const paymentMethods: PaymentMethod[] = [
    { id: randomUUID(), memberId: members[0].id, brand: "visa", last4: "4242", expMonth: 8, expYear: 2029, isDefault: true, createdAt: iso(days(200)) },
    { id: randomUUID(), memberId: members[1].id, brand: "mastercard", last4: "5588", expMonth: 2, expYear: 2028, isDefault: true, createdAt: iso(days(110)) },
  ];

  const connectors: Record<string, ConnectorState> = {};
  for (const c of CONNECTOR_CATALOG) {
    connectors[c.id] = { enabled: true, connected: c.id === "github" || c.id === "supabase" };
  }

  return {
    members,
    invoices,
    paymentMethods,
    connectors,
    ai: {
      defaultProviderId: null,
      demoFallback: true,
      allowOllama: true,
      maxTokens: 4096,
      updatedAt: iso(0),
    },
    providerKeys: {},
  };
}

async function ensureDb(): Promise<AdminDB> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    const db = JSON.parse(raw) as AdminDB;
    // Merge in any fields added after the file was created.
    const base = seed();
    return {
      members: db.members ?? base.members,
      invoices: db.invoices ?? base.invoices,
      paymentMethods: db.paymentMethods ?? base.paymentMethods,
      connectors: { ...base.connectors, ...(db.connectors ?? {}) },
      ai: { ...base.ai, ...(db.ai ?? {}) },
      providerKeys: db.providerKeys ?? {},
    };
  } catch {
    const db = seed();
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
    return db;
  }
}

async function saveDb(db: AdminDB) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

/* ------------------------------- members ------------------------------- */

export async function listMembers() {
  const db = await ensureDb();
  return db.members;
}

export async function createMember(input: {
  name: string;
  email: string;
  role?: MemberRole;
  plan?: MemberPlan;
}) {
  const db = await ensureDb();
  const now = new Date().toISOString();
  const member: Member = {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role ?? "member",
    status: "active",
    plan: input.plan ?? "free",
    credits: 30,
    createdAt: now,
    lastSeenAt: now,
  };
  db.members.unshift(member);
  await saveDb(db);
  return member;
}

export async function updateMember(
  id: string,
  patch: Partial<Pick<Member, "role" | "status" | "plan" | "credits" | "name" | "email">>,
) {
  const db = await ensureDb();
  const m = db.members.find((x) => x.id === id);
  if (!m) return null;
  Object.assign(m, patch);
  await saveDb(db);
  return m;
}

export async function deleteMember(id: string) {
  const db = await ensureDb();
  const before = db.members.length;
  db.members = db.members.filter((x) => x.id !== id);
  await saveDb(db);
  return db.members.length < before;
}

/* ------------------------------ invoices ------------------------------- */

export async function listInvoices() {
  const db = await ensureDb();
  return [...db.invoices].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createInvoice(input: {
  memberId: string;
  amount: number;
  description?: string;
  status?: Invoice["status"];
}) {
  const db = await ensureDb();
  const year = new Date().getFullYear();
  const n = db.invoices.length + 1;
  const invoice: Invoice = {
    id: randomUUID(),
    number: `INV-${year}-${String(n).padStart(4, "0")}`,
    memberId: input.memberId,
    amount: input.amount,
    status: input.status ?? "open",
    description: input.description?.trim() || "Manual invoice",
    createdAt: new Date().toISOString(),
  };
  db.invoices.unshift(invoice);
  await saveDb(db);
  return invoice;
}

export async function updateInvoice(id: string, patch: Partial<Pick<Invoice, "status">>) {
  const db = await ensureDb();
  const inv = db.invoices.find((x) => x.id === id);
  if (!inv) return null;
  Object.assign(inv, patch);
  await saveDb(db);
  return inv;
}

export async function deleteInvoice(id: string) {
  const db = await ensureDb();
  const before = db.invoices.length;
  db.invoices = db.invoices.filter((x) => x.id !== id);
  await saveDb(db);
  return db.invoices.length < before;
}

/* --------------------------- payment methods --------------------------- */

export async function listPaymentMethods() {
  const db = await ensureDb();
  return db.paymentMethods;
}

export async function createPaymentMethod(input: {
  memberId: string;
  brand: PaymentMethod["brand"];
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault?: boolean;
}) {
  const db = await ensureDb();
  if (input.isDefault) {
    for (const pm of db.paymentMethods) {
      if (pm.memberId === input.memberId) pm.isDefault = false;
    }
  }
  const pm: PaymentMethod = {
    id: randomUUID(),
    memberId: input.memberId,
    brand: input.brand,
    last4: input.last4.replace(/\D/g, "").slice(-4) || "0000",
    expMonth: Math.min(12, Math.max(1, Math.round(input.expMonth))),
    expYear: Math.max(new Date().getFullYear(), Math.round(input.expYear)),
    isDefault: input.isDefault ?? db.paymentMethods.every((x) => x.memberId !== input.memberId),
    createdAt: new Date().toISOString(),
  };
  db.paymentMethods.push(pm);
  await saveDb(db);
  return pm;
}

export async function updatePaymentMethod(id: string, patch: Partial<Pick<PaymentMethod, "isDefault">>) {
  const db = await ensureDb();
  const pm = db.paymentMethods.find((x) => x.id === id);
  if (!pm) return null;
  if (patch.isDefault) {
    for (const other of db.paymentMethods) {
      if (other.memberId === pm.memberId) other.isDefault = false;
    }
    pm.isDefault = true;
  }
  await saveDb(db);
  return pm;
}

export async function deletePaymentMethod(id: string) {
  const db = await ensureDb();
  const before = db.paymentMethods.length;
  db.paymentMethods = db.paymentMethods.filter((x) => x.id !== id);
  await saveDb(db);
  return db.paymentMethods.length < before;
}

/* ------------------------------ connectors ----------------------------- */

export async function listConnectorStates() {
  const db = await ensureDb();
  return CONNECTOR_CATALOG.map((c) => ({
    ...c,
    ...(db.connectors[c.id] ?? { enabled: true, connected: false }),
  }));
}

export async function setConnectorEnabled(id: string, enabled: boolean) {
  const db = await ensureDb();
  if (!db.connectors[id]) db.connectors[id] = { enabled: true, connected: false };
  db.connectors[id].enabled = enabled;
  await saveDb(db);
  return db.connectors[id];
}

export async function setConnectorConnected(id: string, connected: boolean) {
  const db = await ensureDb();
  if (!db.connectors[id]) db.connectors[id] = { enabled: true, connected: false };
  db.connectors[id].connected = connected;
  await saveDb(db);
  return db.connectors[id];
}

/** Connected platform ids — powers the dashboard pill ordering. */
export async function connectedConnectorIds() {
  const db = await ensureDb();
  return Object.entries(db.connectors)
    .filter(([, s]) => s.connected)
    .map(([id]) => id);
}

/* --------------------------------- AI ---------------------------------- */

export async function getAIConfig(): Promise<AIConfig> {
  const db = await ensureDb();
  return db.ai;
}

export async function updateAIConfig(patch: Partial<Omit<AIConfig, "updatedAt">>) {
  const db = await ensureDb();
  db.ai = { ...db.ai, ...patch, updatedAt: new Date().toISOString() };
  await saveDb(db);
  return db.ai;
}

export async function setProviderKey(providerId: string, key: string | null) {
  const db = await ensureDb();
  if (key === null || key === "") delete db.providerKeys[providerId];
  else db.providerKeys[providerId] = key;
  await saveDb(db);
}

export async function getProviderKey(providerId: string) {
  const db = await ensureDb();
  return db.providerKeys[providerId] ?? null;
}

/** Which providers have a stored key (booleans only — never the key itself). */
export async function providerKeyFlags() {
  const db = await ensureDb();
  const flags: Record<string, boolean> = {};
  for (const [id, v] of Object.entries(db.providerKeys)) flags[id] = Boolean(v);
  return flags;
}

/* ------------------------------- overview ------------------------------ */

export async function adminOverview() {
  const db = await ensureDb();
  const activeMembers = db.members.filter((m) => m.status === "active").length;
  const paidSum = db.invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);
  const openSum = db.invoices
    .filter((i) => i.status === "open")
    .reduce((sum, i) => sum + i.amount, 0);
  const connectedCount = Object.values(db.connectors).filter((s) => s.connected).length;
  const enabledCount = Object.values(db.connectors).filter((s) => s.enabled).length;
  return {
    members: db.members.length,
    activeMembers,
    suspendedMembers: db.members.length - activeMembers,
    paidRevenue: paidSum,
    openRevenue: openSum,
    connectedCount,
    enabledCount,
    ai: db.ai,
    hasAnyProviderKey: Object.keys(db.providerKeys).length > 0,
  };
}
