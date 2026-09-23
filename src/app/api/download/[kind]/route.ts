import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

/**
 * Desktop installer downloads.
 *
 * Resolution order for the Windows installer:
 *   1. env FREEBUFF_INSTALLER_DIR (a dir containing *-setup.exe / *.msi)
 *   2. ./dist (drop release artifacts here on a web server)
 *   3. src-tauri/target/release/bundle/{nsis,msi} (local dev build output)
 *
 * When no artifact exists the route returns 404 with a helpful JSON error,
 * so the UI can fall back to pointing at GitHub Releases.
 */

export const dynamic = "force-dynamic";

function candidateDirs(): string[] {
  const dirs: string[] = [];
  if (process.env.FREEBUFF_INSTALLER_DIR) dirs.push(process.env.FREEBUFF_INSTALLER_DIR);
  dirs.push(path.join(process.cwd(), "dist"));
  dirs.push(
    path.join(process.cwd(), "src-tauri", "target", "release", "bundle", "nsis"),
  );
  dirs.push(path.join(process.cwd(), "src-tauri", "target", "release", "bundle", "msi"));
  return dirs;
}

export function findInstaller(kind: "nsis" | "msi" | "dmg" | "deb"): { file: string; name: string } | null {
  for (const dir of candidateDirs()) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    const match = files
      .filter((f) =>
        kind === "nsis"
          ? /-setup\.exe$/i.test(f)
          : kind === "msi"
            ? /\.msi$/i.test(f)
            : kind === "dmg"
              ? /\.dmg$/i.test(f)
              : /\.deb$/i.test(f),
      )
      .sort()
      .pop();
    if (match) return { file: path.join(dir, match), name: match };
  }
  return null;
}

function fail(kind: string) {
  return NextResponse.json(
    {
      error: `No ${kind} installer found on this server.`,
      hint: "Build one with `npm run desktop:prepare && npx tauri build`, then copy the bundle output into ./dist (or set FREEBUFF_INSTALLER_DIR).",
    },
    { status: 404 },
  );
}

export async function GET(request: Request, ctx: { params: Promise<{ kind: string }> }) {
  const { kind } = await ctx.params;
  const format = new URL(request.url).searchParams.get("format");

  if (kind === "windows") {
    const pick = format === "msi" ? findInstaller("msi") : findInstaller("nsis");
    if (!pick) return fail("Windows");
    const buf = await fs.promises.readFile(pick.file);
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${pick.name}"`,
        "Content-Length": String(buf.byteLength),
      },
    });
  }

  if (kind === "macos") {
    const pick = findInstaller("dmg");
    if (!pick) return fail("macOS");
    const buf = await fs.promises.readFile(pick.file);
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${pick.name}"`,
      },
    });
  }

  if (kind === "linux") {
    const pick = findInstaller("deb");
    if (!pick) return fail("Linux");
    const buf = await fs.promises.readFile(pick.file);
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${pick.name}"`,
      },
    });
  }

  return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
}
