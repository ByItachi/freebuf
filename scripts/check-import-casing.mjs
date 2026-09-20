// One-off diagnostic: verifies every "@/..." import resolves with exact
// casing against the real files on disk (Windows hides case mismatches;
// Linux CI does not). Run: node scripts/check-import-casing.mjs
import fs from "node:fs";
import path from "node:path";

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
  );
}

const files = walk("src").map((f) => f.split(path.sep).join("/"));
const set = new Set(files);
const exts = ["", ".ts", ".tsx", ".css"];
const dirExts = ["/index.ts", "/index.tsx"]; // folder imports resolve to index
let bad = 0;

for (const f of files.filter((f) => /\.(ts|tsx)$/.test(f))) {
  const src = fs.readFileSync(f, "utf8");
  for (const m of src.matchAll(/from "@\/([^"]+)"/g)) {
    const imp = m[1];
    const ok =
      exts.some((e) => set.has(`src/${imp}${e}`)) ||
      dirExts.some((e) => set.has(`src/${imp}${e}`));
    if (!ok) {
      console.log(`BAD in ${f} -> @/${imp}`);
      bad += 1;
    }
  }
}

console.log(bad === 0 ? "ALL IMPORTS OK" : `problems: ${bad}`);
process.exit(bad === 0 ? 0 : 1);
