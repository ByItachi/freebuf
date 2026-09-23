"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Check, Download, Loader2, Monitor, Smartphone, TerminalSquare } from "lucide-react";

type Latest = {
  version: string;
  publishedAt: string;
  assets: { name: string; size: number; downloadUrl: string }[];
};

function fmtSize(bytes: number): string {
  if (!bytes) return "—";
  const mb = bytes / 1024 / 1024;
  return `${mb >= 100 ? Math.round(mb) : mb.toFixed(1)} MB`;
}

function detectPlatform(): "windows" | "mac" | "linux" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return "windows";
  if (/Mac|iPhone|iPad/i.test(ua)) return "mac";
  if (/Linux|Android/i.test(ua)) return "linux";
  return "other";
}

const subscribeNoop = () => () => {};

export function FreebuffDownload() {
  const [latest, setLatest] = useState<Latest | null>(null);
  const [loading, setLoading] = useState(true);
  // Client-only UA detection without setState-in-effect (SSR renders "other").
  const platform = useSyncExternalStore(subscribeNoop, detectPlatform, () => "other" as const);

  useEffect(() => {
    fetch("/api/download/latest")
      .then((r) => r.json())
      .then((d) => setLatest(d.latest ?? null))
      .catch(() => setLatest(null))
      .finally(() => setLoading(false));
  }, []);

  const winAsset = latest?.assets.find((a) => /-setup\.exe$/.test(a.name));
  const msiAsset = latest?.assets.find((a) => /\.msi$/.test(a.name));

  return (
    <div className="rounded-3xl border border-linen-border bg-warm-sand/60 p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-charcoal px-3 py-1 text-[12px] font-medium text-parchment">
          <Monitor className="size-3.5" /> Manus Desktop
        </span>
        {latest ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-linen-border bg-parchment px-3 py-1 text-[12px] text-dim-gray">
            v{latest.version} · {new Date(latest.publishedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        ) : loading ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-linen-border bg-parchment px-3 py-1 text-[12px] text-dim-gray">
            <Loader2 className="size-3 animate-spin" /> Sürüm kontrol ediliyor…
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {/* Windows — primary card */}
        <div className="rounded-2xl border border-linen-border bg-parchment p-5">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-medium tracking-tight text-charcoal">Windows</p>
            {platform === "windows" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                <Check className="size-3" /> Sistemin
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-[12.5px] leading-snug text-dim-gray">
            Windows 10/11 · 64-bit · NSIS kurulum sihirbazı + MSI
          </p>
          <div className="mt-4 space-y-2">
            <a
              href={winAsset ? winAsset.downloadUrl : "/api/download/windows"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-charcoal px-4 py-2.5 text-[13.5px] font-medium text-parchment transition-colors hover:bg-charcoal/90"
            >
              <Download className="size-4" />
              İndir (.exe){winAsset ? ` · ${fmtSize(winAsset.size)}` : ""}
            </a>
            <a
              href={msiAsset ? msiAsset.downloadUrl : "/api/download/windows?format=msi"}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-linen-border px-4 py-2 text-[12.5px] font-medium text-charcoal transition-colors hover:border-stone"
            >
              MSI paketi{msiAsset ? ` · ${fmtSize(msiAsset.size)}` : ""}
            </a>
          </div>
        </div>

        {/* macOS */}
        <div className="rounded-2xl border border-linen-border bg-parchment p-5">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-medium tracking-tight text-charcoal">macOS</p>
            {platform === "mac" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                <Check className="size-3" /> Sistemin
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-[12.5px] leading-snug text-dim-gray">
            macOS 12+ · Apple Silicon &amp; Intel · .dmg
          </p>
          <div className="mt-4">
            <Link
              href="/api/download/macos"
              prefetch={false}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-linen-border px-4 py-2.5 text-[13.5px] font-medium text-charcoal transition-colors hover:border-stone"
            >
              <Download className="size-4" /> İndir (.dmg)
            </Link>
            <p className="mt-2 text-center text-[11px] text-dim-gray">
              CI ile etiketlenmiş sürümlerde üretilir
            </p>
          </div>
        </div>

        {/* Linux */}
        <div className="rounded-2xl border border-linen-border bg-parchment p-5">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-medium tracking-tight text-charcoal">Linux</p>
            {platform === "linux" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                <Check className="size-3" /> Sistemin
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-[12.5px] leading-snug text-dim-gray">
            Ubuntu/Debian (.deb) · AppImage
          </p>
          <div className="mt-4">
            <Link
              href="/api/download/linux"
              prefetch={false}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-linen-border px-4 py-2.5 text-[13.5px] font-medium text-charcoal transition-colors hover:border-stone"
            >
              <Download className="size-4" /> İndir (.deb)
            </Link>
            <p className="mt-2 text-center text-[11px] text-dim-gray">
              CI ile etiketlenmiş sürümlerde üretilir
            </p>
          </div>
        </div>
      </div>

      {/* CLI strip */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-linen-border bg-parchment p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-black/[0.05]">
            <TerminalSquare className="size-4.5 text-charcoal" />
          </span>
          <div>
            <p className="text-[14px] font-medium tracking-tight text-charcoal">manus CLI</p>
            <p className="text-[12.5px] text-dim-gray">
              Terminalden proje yönetimi + interaktif REPL — <code className="rounded bg-black/[0.05] px-1 py-0.5 text-[11.5px]">npm i -g manus-cli</code>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/manus.mjs"
            download
            className="flex items-center gap-2 rounded-xl bg-charcoal px-4 py-2.5 text-[13.5px] font-medium text-parchment transition-colors hover:bg-charcoal/90"
          >
            <Download className="size-4" /> CLI indir
          </a>
          <a
            href="/cli/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-linen-border px-4 py-2.5 text-[13.5px] font-medium text-charcoal transition-colors hover:border-stone"
          >
            Kılavuz
          </a>
        </div>
      </div>

      {/* Mobile hint */}
      <p className="mt-4 flex items-center gap-2 text-[12px] text-dim-gray">
        <Smartphone className="size-3.5 shrink-0" />
        Mobil cihazdasan: Manus web uygulaması tarayıcından tam çalışır — masaüstü installer&apos;ı bir
        Windows/mac/Linux bilgisayardan indir.
      </p>
    </div>
  );
}
