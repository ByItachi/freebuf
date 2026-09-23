#!/usr/bin/env node
/**
 * Freebuff CLI — manage your Freebuff workspace from the terminal.
 *
 *   freebuff login  [--server http://localhost:3000] [--email you@x.com] [--name "You"]
 *   freebuff whoami
 *   freebuff projects
 *   freebuff new "Prompt or project name"
 *   freebuff open <projectId>
 *   freebuff rm <projectId>
 *   freebuff chat "message"        # ask the agent (demo fallback or configured provider)
 *   freebuff models                # provider availability
 *   freebuff logout
 *
 * Zero dependencies — Node 18+ only. Uses the same JSON API as the web app.
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const require_ = createRequire(import.meta.url);
const pkg = (() => {
  try {
    return require_("../package.json");
  } catch {
    return { name: "freebuff-cli", version: "0.1.0" };
  }
})();

const CONFIG_DIR = path.join(os.homedir(), ".freebuff");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  } catch {
    return {};
  }
}
function writeConfig(cfg) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2));
}

function parseArgs(argv) {
  const args = [];
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--server") opts.server = argv[++i];
    else if (a === "--email") opts.email = argv[++i];
    else if (a === "--name") opts.name = argv[++i];
    else if (a === "--json") opts.json = true;
    else if (a === "--project") opts.project = argv[++i];
    else args.push(a);
  }
  return { args, opts };
}

async function api(cfg, method, urlPath, body) {
  const res = await fetch(`${cfg.server.replace(/\/+$/, "")}${urlPath}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status} ${urlPath}`);
  }
  return data;
}

function out(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

// ---------------------------------------------------------------- commands

async function cmdLogin(opts) {
  const cfg = readConfig();
  const server = opts.server ?? cfg.server ?? "http://localhost:3000";
  const email = opts.email ?? cfg.email ?? `cli-${Date.now()}@freebuff.local`;
  const name = opts.name ?? cfg.name ?? "CLI user";

  const res = await fetch(`${server.replace(/\/+$/, "")}/api/projects`, { method: "HEAD" }).catch(() => null);
  if (!res || !res.ok) {
    console.error(`✗ Cannot reach Freebuff server at ${server}`);
    process.exit(1);
  }

  writeConfig({ ...cfg, server, email, name });
  console.log(`✓ Connected to ${server}`);
  console.log(`  Profile: ${name} <${email}>`);
}

async function cmdWhoami() {
  const cfg = readConfig();
  if (!cfg.server) {
    console.error("✗ Not logged in — run `freebuff login --server http://localhost:3000`");
    process.exit(1);
  }
  console.log(`${cfg.name ?? "—"} <${cfg.email ?? "—"}> @ ${cfg.server}`);
}

async function cmdProjects(opts) {
  const cfg = readConfig();
  if (!cfg.server) {
    console.error("✗ Not logged in — run `freebuff login` first");
    process.exit(1);
  }
  const { projects } = await api(cfg, "GET", "/api/projects");
  if (opts.json) return out({ projects });
  if (projects.length === 0) {
    console.log("No projects yet — create one with `freebuff new \"My app\"`");
    return;
  }
  const idw = Math.max(...projects.map((p) => p.id.length));
  for (const p of projects) {
    console.log(`${p.id.padEnd(idw)}  ${p.name}${p.starred ? "  ★" : ""}`);
  }
  console.log(`\n${projects.length} project(s)`);
}

async function cmdNew(args) {
  const cfg = readConfig();
  if (!cfg.server) {
    console.error("✗ Not logged in — run `freebuff login` first");
    process.exit(1);
  }
  const prompt = args.join(" ").trim();
  if (!prompt) {
    console.error('Usage: freebuff new "Todo app with auth"');
    process.exit(1);
  }
  const { project } = await api(cfg, "POST", "/api/projects", { prompt });
  console.log(`✓ Created ${project.id}`);
  console.log(`  ${project.name}`);
  console.log(`  Open: ${cfg.server.replace(/\/+$/, "")}/projects/${project.id}`);
}

async function cmdOpen(args) {
  const cfg = readConfig();
  if (!cfg.server) {
    console.error("✗ Not logged in — run `freebuff login` first");
    process.exit(1);
  }
  const id = args[0];
  if (!id) {
    console.error("Usage: freebuff open <projectId>");
    process.exit(1);
  }
  const { project } = await api(cfg, "GET", `/api/projects/${encodeURIComponent(id)}`);
  const url = `${cfg.server.replace(/\/+$/, "")}/projects/${project.id}`;
  console.log(`Opening ${url} …`);
  const open =
    process.platform === "win32"
      ? "cmd"
      : process.platform === "darwin"
        ? "open"
        : "xdg-open";
  const { spawn } = await import("node:child_process");
  spawn(open, process.platform === "win32" ? ["/c", "start", "", url] : [url], { detached: true, stdio: "ignore" }).unref();
}

async function cmdRm(args) {
  const cfg = readConfig();
  if (!cfg.server) {
    console.error("✗ Not logged in — run `freebuff login` first");
    process.exit(1);
  }
  const id = args[0];
  if (!id) {
    console.error("Usage: freebuff rm <projectId>");
    process.exit(1);
  }
  await api(cfg, "DELETE", `/api/projects/${encodeURIComponent(id)}`);
  console.log(`✓ Deleted ${id}`);
}

async function cmdChat(args) {
  const cfg = readConfig();
  if (!cfg.server) {
    console.error("✗ Not logged in — run `freebuff login` first");
    process.exit(1);
  }
  const message = args.join(" ").trim();
  if (!message) {
    console.error('Usage: freebuff chat "add login with Google"');
    process.exit(1);
  }
  const data = await api(cfg, "POST", "/api/chat", {
    source: "demo",
    model: "freebuff-demo",
    messages: [{ role: "user", content: message }],
  });
  if (data.error) {
    console.error(`✗ ${data.error}`);
    process.exit(1);
  }
  console.log(data.content);
}

async function cmdModels(opts = {}) {
  const cfg = readConfig();
  const data = await api(cfg, "GET", "/api/chat");
  if (opts.json) return out(data);
  for (const p of data.providers ?? []) {
    const mark = p.hasEnvKey ? "✓" : " ";
    console.log(`[${mark}] ${p.id}${p.hasEnvKey ? "  (env key set)" : ""}`);
  }
  console.log("\nKeylar sunucu ortamından veya /admin → AI sekmesinden ayarlanır.");
}

async function cmdLogout() {
  fs.rmSync(CONFIG_FILE, { force: true });
  console.log("✓ Logged out");
}

// ---------------------------------------------------------------- main

const { args, opts } = parseArgs(process.argv.slice(2));
const cmd = args[0];

const commands = {
  login: () => cmdLogin(opts),
  whoami: () => cmdWhoami(),
  projects: () => cmdProjects(opts),
  new: () => cmdNew(args.slice(1)),
  open: () => cmdOpen(args.slice(1)),
  rm: () => cmdRm(args.slice(1)),
  chat: () => cmdChat(args.slice(1)),
  models: () => cmdModels(),
  logout: () => cmdLogout(),
};

if (!cmd || cmd === "--help" || cmd === "-h") {
  console.log(`Freebuff CLI ${pkg.version}

Usage: freebuff <command> [args]

  login   [--server URL] [--email E] [--name N]   Connect to a Freebuff server
  whoami                                          Show connection profile
  projects [--json]                               List projects
  new "prompt or name"                            Create a project
  open <projectId>                                Open a project in browser
  rm <projectId>                                  Delete a project
  chat "message"                                  Ask the agent (demo or provider)
  models                                          List AI providers
  logout                                          Forget the server & profile
`);
  process.exit(0);
}

const fn = commands[cmd];
if (!fn) {
  console.error(`✗ Unknown command: ${cmd} — try \`freebuff --help\``);
  process.exit(1);
}
await fn();
