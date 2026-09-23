import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

type Asset = { name: string; size: number; downloadUrl: string };
type Latest = { version: string; publishedAt: string; assets: Asset[] };

/** Reads the desktop version from the Tauri config (single source of truth). */
async function desktopVersion(): Promise<string> {
  try {
    const conf = await fs.promises.readFile(
      path.join(process.cwd(), "src-tauri", "tauri.conf.json"),
      "utf8",
    );
    const v = JSON.parse(conf)?.version;
    if (typeof v === "string") return v;
  } catch {}
  return "0.0.0";
}

/** Directories scanned for installer artifacts (dev build output + ./dist staging). */
function installerDirs(): string[] {
  return [
    path.join(process.cwd(), "dist"),
    path.join(process.cwd(), "src-tauri", "target", "release", "bundle", "nsis"),
    path.join(process.cwd(), "src-tauri", "target", "release", "bundle", "msi"),
  ];
}

export async function GET() {
  const version = await desktopVersion();
  const assets: Asset[] = [];

  for (const dir of installerDirs()) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      const isNsis = /-setup\.exe$/i.test(f);
      const isMsi = /\.msi$/i.test(f);
      if (!isNsis && !isMsi) continue;
      // de-dupe: prefer the first occurrence (dist wins over build output)
      if (assets.some((a) => a.name === f)) continue;
      const st = await fs.promises.stat(path.join(dir, f));
      assets.push({
        name: f,
        size: st.size,
        downloadUrl: isNsis ? "/api/download/windows" : "/api/download/windows?format=msi",
      });
    }
  }

  const latest: Latest = {
    version,
    publishedAt: new Date().toISOString(),
    assets,
  };
  return NextResponse.json({ latest });
}
