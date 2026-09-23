/**
 * Desktop bootstrap — bundled-resource entry the Tauri shell spawns.
 *
 * The Tauri shell spawns `node server/server.js` with cwd inside the bundled
 * resources. It passes:
 *   - PORT / HOSTNAME       where to listen
 *   - FREEBUFF_STANDALONE   path to the Next standalone dir (contains server.js)
 *   - FREEBUFF_DATA_DIR     writable per-user data dir
 *   - ADMIN_PASSWORD        fixed local admin password
 *
 * This wrapper chdir's into the standalone dir (so relative asset paths work)
 * and forwards to the standalone `server.js`, preserving env/args.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const standalone = process.env.FREEBUFF_STANDALONE;
if (!standalone || !fs.existsSync(path.join(standalone, "server.js"))) {
  console.error(
    `[freebuff] standalone server not found at: ${standalone ?? "(unset)"} — ` +
      "bundle is broken; run `npm run desktop:prepare` before `tauri build`.",
  );
  process.exit(1);
}

process.chdir(standalone);

const child = spawn(process.execPath, [path.join(standalone, "server.js")], {
  stdio: "inherit",
  env: process.env,
});

child.on("error", (err) => {
  console.error(`[freebuff] standalone server failed: ${err.message}`);
  process.exit(1);
});
child.on("exit", (code) => process.exit(code ?? 0));

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    child.kill();
  });
}
