#!/usr/bin/env node
/**
 * manus CLI — talk to your Manus workspace from the terminal.
 *
 * One-shot mode:
 *   manus login  [--server http://localhost:3000] [--email you@x.com] [--name "You"]
 *   manus projects
 *   manus new "Prompt or project name"
 *   manus open <projectId>
 *   manus rm <projectId>
 *   manus models
 *   manus logout
 *
 * Interactive REPL (like llama-cli):
 *   manus chat                       # connect + enter the REPL
 *   manus chat "add auth"            # one-shot ask, then exit
 *
 * REPL commands:
 *   /exit, /quit or Ctrl+C   stop or exit
 *   /regen                   regenerate the last response
 *   /clear                   clear the chat history
 *   /read <file>             attach a text file to the context
 *   /projects                list workspace projects
 *   /new <name>              create a project and select it
 *   /open <id|name>          open the selected project in the browser
 *   /model                   show provider availability
 *   /server <url>            switch server
 *   /help                    list commands
 *
 * Zero dependencies — Node 18+ only. Uses the same JSON API as the web app.
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";
import { spawn } from "node:child_process";

const require_ = createRequire(import.meta.url);
const pkg = (() => {
  try {
    return require_("../package.json");
  } catch {
    return { name: "manus-cli", version: "0.2.0" };
  }
})();

const CONFIG_DIR = path.join(os.homedir(), ".manus");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

// Freebuff palette (ANSI): ink #030303, parchment #fcfbf8, dim #5f5f5d
const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  white: "\x1b[97m",
  black: "\x1b[30m",
  invert: "\x1b[7m",
};
const supportsColor = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (s, ...codes) => (supportsColor ? `${codes.join("")}${s}${C.reset}` : s);

const BANNER = String.raw`
  __  __
 |  \/  |   _ __     ___   _ __    ___
 | |\/| |  | '_ \   / _ \ | '_ \  / _ \
 | |  | |  | | | | |  __/ | | | | |  __/
 |_|  |_|  |_| |_|  \___| |_| |_|  \___|

`;

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
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status} ${urlPath}`);
  return data;
}

function ok(msg) {
  console.log(paint(`✓ ${msg}`, C.green));
}
function fail(msg) {
  console.error(paint(`✗ ${msg}`, C.red));
}

// ---------------------------------------------------------------- one-shot

async function cmdLogin(opts) {
  const cfg = readConfig();
  const server = opts.server ?? cfg.server ?? "http://localhost:3000";
  const email = opts.email ?? cfg.email ?? `cli-${Date.now()}@manus.local`;
  const name = opts.name ?? cfg.name ?? "CLI user";
  const res = await fetch(`${server.replace(/\/+$/, "")}/api/projects`, { method: "HEAD" }).catch(() => null);
  if (!res || !res.ok) {
    fail(`Cannot reach Manus server at ${server}`);
    process.exit(1);
  }
  writeConfig({ ...cfg, server, email, name });
  ok(`Connected to ${server}`);
  console.log(`  Profile: ${name} <${email}>`);
}

async function cmdWhoami() {
  const cfg = readConfig();
  if (!cfg.server) {
    fail("Not logged in — run `manus login --server http://localhost:3000`");
    process.exit(1);
  }
  console.log(`${cfg.name ?? "—"} <${cfg.email ?? "—"}> @ ${cfg.server}`);
}

async function cmdProjects(opts) {
  const cfg = requireConfig();
  const { projects } = await api(cfg, "GET", "/api/projects");
  if (opts.json) return console.log(JSON.stringify({ projects }, null, 2));
  if (projects.length === 0) {
    console.log("No projects yet — create one with `manus new \"My app\"`");
    return;
  }
  const idw = Math.max(...projects.map((p) => p.id.length));
  for (const p of projects) {
    console.log(`${paint(p.id.padEnd(idw), C.dim)}  ${p.name}${p.starred ? paint("  ★", C.yellow) : ""}`);
  }
  console.log(`\n${projects.length} project(s)`);
}

function requireConfig() {
  const cfg = readConfig();
  if (!cfg.server) {
    fail("Not logged in — run `manus login` first");
    process.exit(1);
  }
  return cfg;
}

async function cmdNew(args) {
  const cfg = requireConfig();
  const prompt = args.join(" ").trim();
  if (!prompt) {
    console.error('Usage: manus new "Todo app with auth"');
    process.exit(1);
  }
  const { project } = await api(cfg, "POST", "/api/projects", { prompt });
  ok(`Created ${project.id}`);
  console.log(`  ${project.name}`);
  console.log(`  Open: ${cfg.server.replace(/\/+$/, "")}/projects/${project.id}`);
}

async function cmdOpen(args) {
  const cfg = requireConfig();
  const id = args[0];
  if (!id) {
    console.error("Usage: manus open <projectId>");
    process.exit(1);
  }
  const { project } = await api(cfg, "GET", `/api/projects/${encodeURIComponent(id)}`);
  const url = `${cfg.server.replace(/\/+$/, "")}/projects/${project.id}`;
  console.log(`Opening ${url} …`);
  const open = process.platform === "win32" ? "cmd" : process.platform === "darwin" ? "open" : "xdg-open";
  spawn(open, process.platform === "win32" ? ["/c", "start", "", url] : [url], {
    detached: true,
    stdio: "ignore",
  }).unref();
}

async function cmdRm(args) {
  const cfg = requireConfig();
  const id = args[0];
  if (!id) {
    console.error("Usage: manus rm <projectId>");
    process.exit(1);
  }
  await api(cfg, "DELETE", `/api/projects/${encodeURIComponent(id)}`);
  ok(`Deleted ${id}`);
}

async function cmdModels(opts = {}) {
  const cfg = requireConfig();
  const data = await api(cfg, "GET", "/api/chat");
  if (opts.json) return console.log(JSON.stringify(data, null, 2));
  for (const p of data.providers ?? []) {
    const mark = p.hasEnvKey ? "✓" : " ";
    console.log(`[${mark}] ${p.id}${p.hasEnvKey ? paint("  (env key set)", C.dim) : ""}`);
  }
  console.log(`\nKeys are set server-side (env or /admin → Cloud & AI balance).`);
}

// ---------------------------------------------------------------- REPL

async function startRepl(cfg) {
  const state = {
    server: cfg.server.replace(/\/+$/, ""),
    history: [], // { role, content }
    projectId: null,
    projectName: null,
    attachments: [], // { name, content }
    lastUserMessage: null,
  };

  console.log(paint(BANNER, C.bold));
  console.log(paint(`  manus`, C.bold) + paint(`  · ${state.server}`, C.dim));
  console.log(
    paint(
      `  build : ${pkg.version}   modality : chat + projects   data : ${CONFIG_FILE}`,
      C.dim,
    ),
  );
  console.log("");
  console.log(paint("available commands:", C.dim));
  const help = [
    ["/exit or Ctrl+C", "stop or exit"],
    ["/regen", "regenerate the last response"],
    ["/clear", "clear the chat history"],
    ["/read <file>", "attach a text file to the context"],
    ["/projects", "list workspace projects"],
    ["/new <prompt>", "create a project and select it"],
    ["/open <id|name>", "open the selected project in the browser"],
    ["/model", "show AI provider availability"],
    ["/server <url>", "switch server"],
    ["/help", "list commands"],
  ];
  for (const [cmd, desc] of help) {
    console.log(`  ${paint(cmd.padEnd(18), C.cyan)} ${paint(desc, C.dim)}`);
  }
  console.log("");
  console.log(
    paint(
      `  Greets you like the web app: type a message, or /new to scaffold a project.\n`,
      C.dim,
    ),
  );

  // Big "Hello there" style greeting, like the desktop UI's empty state.
  console.log(paint(`  ${"Hello there".toUpperCase()}`, C.bold));
  console.log(paint(`  Type a message or /read a file to get started`, C.dim));
  console.log("");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: paint("you > ", C.green),
    terminal: process.stdin.isTTY,
  });
  if (process.stdin.isTTY) rl.prompt();

  // Serialize async line handling so /exit waits for pending work (piped input too).
  let queue = Promise.resolve();
  let closed = false;

  async function send(text) {
    // Build the message list: system context from project + attachments.
    const messages = [];
    const ctx = [];
    if (state.projectId) ctx.push(`Selected project: ${state.projectName} (${state.projectId}).`);
    for (const a of state.attachments) {
      ctx.push(`Attached file "${a.name}":\n${a.content.slice(0, 8000)}`);
    }
    if (ctx.length) messages.push({ role: "system", content: ctx.join("\n\n") });
    messages.push(...state.history.slice(-20));
    messages.push({ role: "user", content: text });

    process.stdout.write(paint("manus > ", C.cyan));
    try {
      const data = await api(cfg, "POST", "/api/chat", {
        source: "demo",
        model: "manus-demo",
        messages,
      });
      if (data.error) {
        fail(data.error);
        return;
      }
      console.log(data.content.trim());
      if (data.previewHtml) {
        console.log(paint(`  [preview html available — ${data.previewHtml.length} bytes]`, C.dim));
      }
      state.history.push({ role: "user", content: text });
      state.history.push({ role: "assistant", content: data.content });
      state.lastUserMessage = text;
    } catch (e) {
      fail(e.message);
    }
  }

  async function regen() {
    if (!state.lastUserMessage) {
      fail("Nothing to regenerate yet");
      return;
    }
    // drop the last assistant turn and ask again
    state.history = state.history.slice(0, -2);
    await send(state.lastUserMessage);
  }

  async function listProjects() {
    const { projects } = await api(cfg, "GET", "/api/projects");
    if (projects.length === 0) {
      console.log("No projects yet — /new <prompt> to create one.");
      return;
    }
    for (const p of projects) {
      const sel = p.id === state.projectId ? paint("→", C.green) : " ";
      console.log(`${sel} ${paint(p.id.slice(0, 8), C.dim)}  ${p.name}${p.starred ? paint(" ★", C.yellow) : ""}`);
    }
    console.log(paint(`\n${projects.length} project(s) — /open <id|name> to select\n`, C.dim));
  }

  async function newProject(args) {
    const prompt = args.join(" ").trim();
    if (!prompt) {
      fail('Usage: /new "Todo app with auth"');
      return;
    }
    const { project } = await api(cfg, "POST", "/api/projects", { prompt });
    state.projectId = project.id;
    state.projectName = project.name;
    ok(`Created and selected: ${project.name} (${project.id})`);
  }

  async function openProject(args) {
    const q = args.join(" ").trim();
    const { projects } = await api(cfg, "GET", "/api/projects");
    let target = null;
    if (q) {
      target = projects.find((p) => p.id === q || p.id.startsWith(q) || p.name.toLowerCase().includes(q.toLowerCase()));
    } else if (state.projectId) {
      target = projects.find((p) => p.id === state.projectId);
    }
    if (!target) {
      fail("No project matched — /projects to list, or /open <id|name>");
      return;
    }
    const url = `${state.server}/projects/${target.id}`;
    const open = process.platform === "win32" ? "cmd" : process.platform === "darwin" ? "open" : "xdg-open";
    spawn(open, process.platform === "win32" ? ["/c", "start", "", url] : [url], {
      detached: true,
      stdio: "ignore",
    }).unref();
    ok(`Opening ${url}`);
  }

  function readAttachment(file) {
    const p = path.resolve(file);
    if (!fs.existsSync(p)) {
      fail(`File not found: ${p}`);
      return;
    }
    const content = fs.readFileSync(p, "utf8");
    state.attachments.push({ name: path.basename(p), content });
    ok(`Loaded text from '${path.basename(p)}' (${content.length} bytes)`);
  }

  rl.on("line", (line) => {
    const trimmed = line.trim();
    queue = queue
      .then(async () => {
        if (closed || !trimmed) return;
        if (trimmed.startsWith("/")) {
          const [rawCmd, ...rest] = trimmed.split(/\s+/);
          const cmd = rawCmd.toLowerCase();
          if (cmd === "/exit" || cmd === "/quit" || cmd === "/q") {
            closed = true;
            rl.close();
            return;
          } else if (cmd === "/regen") {
            await regen();
          } else if (cmd === "/clear") {
            state.history = [];
            state.attachments = [];
            state.lastUserMessage = null;
            ok("Chat history cleared");
          } else if (cmd === "/read") {
            readAttachment(rest[0]);
          } else if (cmd === "/projects") {
            await listProjects();
          } else if (cmd === "/new") {
            await newProject(rest);
          } else if (cmd === "/open") {
            await openProject(rest);
          } else if (cmd === "/model") {
            const data = await api(cfg, "GET", "/api/chat");
            for (const p of data.providers ?? []) {
              console.log(`[${p.hasEnvKey ? "✓" : " "}] ${p.id}${p.hasEnvKey ? paint("  (env key set)", C.dim) : ""}`);
            }
            console.log(paint(`Keys are set server-side (env or /admin → Cloud & AI balance).`, C.dim));
          } else if (cmd === "/server") {
            if (!rest[0]) {
              console.log(`server: ${state.server}`);
            } else {
              state.server = rest[0].replace(/\/+$/, "");
              cfg.server = state.server;
              writeConfig({ ...cfg, server: state.server });
              ok(`Server set to ${state.server}`);
            }
          } else if (cmd === "/help") {
            for (const [c, d] of help) console.log(`  ${paint(c.padEnd(18), C.cyan)} ${paint(d, C.dim)}`);
          } else {
            fail(`Unknown command: ${rawCmd} — /help lists commands`);
          }
        } else {
          await send(trimmed);
        }
      })
      .catch((e) => fail(e.message))
      .finally(() => {
        if (process.stdin.isTTY && !closed) rl.prompt();
      });
  });

  rl.on("close", () => {
    queue.finally(() => {
      if (process.stdin.isTTY || state.history.length > 0) {
        console.log(paint("\nbye ✓", C.dim));
      }
      // process.reallyExit skips libuv teardown — avoids the win32
      // `!(handle->flags & UV_HANDLE_CLOSING)` assertion from readline.
      process.reallyExit?.(0) ?? process.exit(0);
    });
  });
}

// ---------------------------------------------------------------- main

const { args, opts } = parseArgs(process.argv.slice(2));
const cmd = args[0];

if (!cmd || cmd === "--help" || cmd === "-h") {
  console.log(paint(BANNER, C.bold));
  console.log(`manus CLI ${pkg.version}\n`);
  console.log(`Usage: manus <command> [args]\n`);
  const cmds = [
    ["login   [--server URL] [--email E] [--name N]", "Connect to a Manus server"],
    ["whoami", "Show connection profile"],
    ["projects [--json]", "List projects"],
    ['new "prompt or name"', "Create a project"],
    ["open <projectId>", "Open a project in browser"],
    ["rm <projectId>", "Delete a project"],
    ['chat "message"', "One-shot ask (demo or provider)"],
    ["chat", "Interactive REPL — like llama-cli"],
    ["models", "List AI providers"],
    ["logout", "Forget the server & profile"],
  ];
  for (const [c, d] of cmds) console.log(`  ${paint(c.padEnd(44), C.cyan)} ${d}`);
  console.log(`\nREPL inside \`manus chat\`: /exit /regen /clear /read /projects /new /open /model /server /help`);
  process.exit(0);
}

const commands = {
  login: () => cmdLogin(opts),
  whoami: () => cmdWhoami(),
  projects: () => cmdProjects(opts),
  new: () => cmdNew(args.slice(1)),
  open: () => cmdOpen(args.slice(1)),
  rm: () => cmdRm(args.slice(1)),
  chat: () => {
    const text = args.slice(1).join(" ").trim();
    if (text) return oneShotChat(text);
    return startRepl(requireConfig());
  },
  models: () => cmdModels(opts),
  logout: () => {
    fs.rmSync(CONFIG_FILE, { force: true });
    ok("Logged out");
  },
};

async function oneShotChat(message) {
  const cfg = requireConfig();
  try {
    const data = await api(cfg, "POST", "/api/chat", {
      source: "demo",
      model: "manus-demo",
      messages: [{ role: "user", content: message }],
    });
    if (data.error) {
      fail(data.error);
      process.exit(1);
    }
    console.log(data.content.trim());
  } catch (e) {
    fail(e.message);
    process.exit(1);
  }
}

const fn = commands[cmd];
if (!fn) {
  fail(`Unknown command: ${cmd} — try \`manus --help\``);
  process.exit(1);
}
await fn();
