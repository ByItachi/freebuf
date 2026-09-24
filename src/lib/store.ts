import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type ProjectMessage = { role: "user" | "assistant"; content: string; createdAt: string };
export type ProjectFile = { path: string; content: string; language?: string };
export type Project = {
  id: string;
  name: string;
  prompt: string;
  starred: boolean;
  createdByMe: boolean;
  shared: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  messages: ProjectMessage[];
  files: ProjectFile[];
  previewHtml: string;
  cover?: string;
};

type DB = { projects: Project[] };

// Data lives next to the app in dev; override with FREEBUFF_DATA_DIR for
// installed desktop builds (Program Files is not writable) and hosted deploys.
const DATA_DIR = process.env.FREEBUFF_DATA_DIR ?? path.join(process.cwd(), ".data");
const DB_PATH = path.join(DATA_DIR, "projects.json");

const COVERS = [
  "/refero/card-01.jpg",
  "/refero/card-02.jpg",
  "/refero/card-03.jpg",
  "/refero/card-04.jpg",
  "/refero/card-05.jpg",
  "/refero/card-06.jpg",
];

async function ensureDb(): Promise<DB> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(raw) as DB;
  } catch {
    const seed: DB = { projects: [] };
    await fs.writeFile(DB_PATH, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
}

async function saveDb(db: DB) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

function titleFromPrompt(prompt: string) {
  const t = prompt.trim().replace(/\s+/g, " ");
  if (!t) return "Untitled project";
  return t.length > 48 ? t.slice(0, 48).trimEnd() + "\u2026" : t;
}

export function buildPreviewHtml(prompt: string, title?: string) {
  const safeTitle = (title || titleFromPrompt(prompt)).replace(/</g, "");
  const safePrompt = prompt.replace(/</g, "").slice(0, 280);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${safeTitle}</title>
<style>
  :root { color-scheme: light; --bg:#fcfbf8; --card:#f7f4ed; --ink:#1c1c1c; --muted:#5f5f5d; --line:#eceae4; }
  *{box-sizing:border-box} body{margin:0;font-family:Inter,system-ui,sans-serif;background:var(--bg);color:var(--ink);letter-spacing:-0.025em}
  .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;text-align:center;
    background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(94,137,242,.35),transparent 60%),radial-gradient(ellipse 50% 40% at 80% 20%,rgba(255,102,244,.25),transparent 55%),var(--bg)}
  h1{font-size:clamp(32px,6vw,56px);font-weight:500;margin:0 0 12px;line-height:1.1}
  p{max-width:560px;color:var(--muted);font-size:16px;line-height:1.5;margin:0 0 28px}
  .card{background:var(--card);border:1px solid var(--line);border-radius:24px;padding:20px 24px;max-width:520px;width:100%;text-align:left}
  .btn{display:inline-flex;align-items:center;gap:8px;border-radius:9999px;background:rgba(0,0,0,.88);color:#fcfbf8;padding:10px 16px;border:0;font:inherit;cursor:pointer}
  .row{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}
  .pill{border:1px solid var(--line);border-radius:9999px;padding:8px 12px;font-size:13px;color:var(--ink);background:transparent}
</style>
</head>
<body>
  <main class="hero">
    <h1>${safeTitle}</h1>
    <p>${safePrompt || "Your AI-built app preview."}</p>
    <div class="card">
      <strong>Live preview</strong>
      <p style="margin:8px 0 0;font-size:14px">Generated from your prompt. Keep chatting to refine layout, copy, and features.</p>
      <div class="row">
        <button class="btn" onclick="alert('Connected to Manus AI builder')">Get started</button>
        <button class="pill" onclick="document.body.style.filter=document.body.style.filter?'':'hue-rotate(20deg)'">Tweak theme</button>
      </div>
    </div>
  </main>
</body>
</html>`;
}

export async function listProjects() {
  const db = await ensureDb();
  return db.projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getProject(id: string) {
  const db = await ensureDb();
  return db.projects.find((p) => p.id === id) ?? null;
}

export async function createProject(input: { prompt: string; name?: string }) {
  const db = await ensureDb();
  const now = new Date().toISOString();
  const name = input.name?.trim() || titleFromPrompt(input.prompt);
  const project: Project = {
    id: randomUUID(),
    name,
    prompt: input.prompt.trim(),
    starred: false,
    createdByMe: true,
    shared: false,
    published: false,
    createdAt: now,
    updatedAt: now,
    messages: input.prompt.trim()
      ? [{ role: "user", content: input.prompt.trim(), createdAt: now }]
      : [],
    files: [
      {
        path: "index.html",
        language: "html",
        content: buildPreviewHtml(input.prompt, name),
      },
    ],
    previewHtml: buildPreviewHtml(input.prompt, name),
    cover: COVERS[db.projects.length % COVERS.length],
  };
  db.projects.unshift(project);
  await saveDb(db);
  return project;
}

export async function updateProject(
  id: string,
  patch: Partial<Pick<Project, "name" | "starred" | "published" | "shared" | "messages" | "files" | "previewHtml" | "prompt">>,
) {
  const db = await ensureDb();
  const i = db.projects.findIndex((p) => p.id === id);
  if (i < 0) return null;
  db.projects[i] = {
    ...db.projects[i],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await saveDb(db);
  return db.projects[i];
}

export async function deleteProject(id: string) {
  const db = await ensureDb();
  const before = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id);
  await saveDb(db);
  return db.projects.length < before;
}

/** Remix: deep-copy a project under a new id with a fresh creation stamp. */
export async function cloneProject(source: Project) {
  const db = await ensureDb();
  const now = new Date().toISOString();
  const clone: Project = {
    ...structuredClone(source),
    id: randomUUID(),
    name: `${source.name} (remix)`,
    starred: false,
    published: false,
    shared: false,
    createdByMe: true,
    createdAt: now,
    updatedAt: now,
  };
  db.projects.unshift(clone);
  await saveDb(db);
  return clone;
}

export function demoAssistantReply(userText: string, projectName: string) {
  const lower = userText.toLowerCase();
  let focus = "landing page";
  if (lower.includes("dashboard")) focus = "dashboard";
  else if (lower.includes("saas") || lower.includes("pricing")) focus = "SaaS pricing page";
  else if (lower.includes("mobile")) focus = "mobile-first app shell";
  else if (lower.includes("auth") || lower.includes("login")) focus = "auth flow";

  return `I updated **${projectName}** as a ${focus}.

### What I built
- Warm parchment canvas with Freebuff-style typography
- Hero + primary CTA wired to your prompt
- Responsive card layout and subtle prism accent

### Next ideas
1. Add a waitlist form with email validation
2. Connect Supabase / Stripe
3. Generate a second page (pricing or docs)

Preview on the right is live \u2014 tell me what to change (copy, colors, sections, or data).`;
}