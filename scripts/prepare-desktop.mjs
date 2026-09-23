#!/usr/bin/env node
/**
 * desktop:prepare — assembles everything the Tauri bundle needs:
 *
 *   src-tauri/bin/node/*       bundled Node runtime (node.exe / node)
 *   src-tauri/bin/standalone/* Next standalone server (NEXT_OUTPUT=standalone build)
 *   server/server.js           bootstrap entry bundled as a Tauri resource
 *
 * Usage: npm run desktop:prepare && npm run tauri:build
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const binDir = path.join(root, "src-tauri", "bin");
process.chdir(root);

const step = (msg) => console.log(`\n=== ${msg} ===`);

// 1) Build the Next app as a standalone, self-contained server.
step("Building Next.js standalone output");
execSync("npx next build", {
  stdio: "inherit",
  env: { ...process.env, NEXT_OUTPUT: "standalone" },
});

// 2) Assemble src-tauri/bin/standalone: server + client assets + public files.
step("Assembling src-tauri/bin/standalone");
rmSync(path.join(binDir, "standalone"), { recursive: true, force: true });
mkdirSync(binDir, { recursive: true });
cpSync(path.join(root, ".next", "standalone"), path.join(binDir, "standalone"), {
  recursive: true,
});
// Standalone does not ship client assets or public/ — copy them next to server.js.
cpSync(
  path.join(root, ".next", "static"),
  path.join(binDir, "standalone", ".next", "static"),
  { recursive: true },
);
cpSync(path.join(root, "public"), path.join(binDir, "standalone", "public"), {
  recursive: true,
});
console.log("standalone assembled");

// 3) Bundle the Node runtime so end users need nothing installed.
step("Bundling Node runtime");
const nodeDir = path.join(binDir, "node");
rmSync(nodeDir, { recursive: true, force: true });
mkdirSync(nodeDir, { recursive: true });
const nodeDest = path.join(
  nodeDir,
  process.platform === "win32" ? "node.exe" : "node",
);
cpSync(process.execPath, nodeDest);
console.log(`node runtime bundled: ${nodeDest}`);

// 4) Verify everything Tauri will bundle exists.
step("Verifying bundle inputs");
const required = [
  path.join(binDir, "standalone", "server.js"),
  path.join(binDir, "standalone", ".next", "static"),
  path.join(binDir, "standalone", "public"),
  nodeDest,
  path.join(root, "server", "server.js"),
];
for (const f of required) {
  if (!existsSync(f)) {
    console.error(`missing required bundle input: ${f}`);
    process.exit(1);
  }
}
console.log("all bundle inputs present ✓");
console.log("\nNext: npm run tauri:build   (or npx tauri build)");
