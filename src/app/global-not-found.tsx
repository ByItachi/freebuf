import "./globals.css";

/* eslint-disable @next/next/no-img-element -- global-not-found bypasses the layout; keep it minimal */

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-10 bg-black px-6 text-center"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          <img
            src="/404-flower.png"
            alt=""
            className="size-[140px] object-contain drop-shadow-[0_0_24px_rgba(255,102,244,0.35)]"
          />
          <div className="space-y-2">
            <h1 className="text-[26px] font-medium tracking-tight text-white">
              Page not found
            </h1>
            <p className="text-[15px] text-white/60">
              The page you’re looking for doesn’t exist or has been moved.
            </p>
          </div>
          <a
            href="/dashboard"
            className="flex h-10 items-center rounded-full bg-white px-5 text-[14px] font-medium text-black transition-colors hover:bg-white/90"
          >
            Go home
          </a>
        </div>
      </body>
    </html>
  );
}
