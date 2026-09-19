import { NextResponse } from "next/server";

/**
 * Same-origin image proxy for Lovable CDN assets.
 * The browser hits /api/img (same host, no hotlink/bot friction) while the
 * server fetches upstream with browser headers and caches aggressively.
 */
const ALLOW = new Set([
  "lovable.dev",
  "assets.lovable.dev",
  "storage.googleapis.com",
  "lh3.googleusercontent.com",
  "cdn.jsdelivr.net",
]);

export async function GET(request: Request) {
  const src = new URL(request.url).searchParams.get("src");
  if (!src) {
    return NextResponse.json({ error: "Missing src" }, { status: 400 });
  }
  let upstream: URL;
  try {
    upstream = new URL(src);
  } catch {
    return NextResponse.json({ error: "Invalid src" }, { status: 400 });
  }
  if (upstream.protocol !== "https:" || !ALLOW.has(upstream.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  try {
    const res = await fetch(upstream.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok || !res.body) {
      return NextResponse.json({ error: `Upstream HTTP ${res.status}` }, { status: 502 });
    }
    const buf = await res.arrayBuffer();
    return new Response(buf, {
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Image fetch failed: ${msg}` }, { status: 502 });
  }
}
