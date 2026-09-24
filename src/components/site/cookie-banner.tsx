"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CookieBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        if (!localStorage.getItem("freebuff-consent")) setVisible(true);
      } catch {
        setVisible(true);
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);
  const decide = (v: string) => {
    try {
      localStorage.setItem("freebuff-consent", v);
    } catch {}
    setVisible(false);
  };
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/new") ||
      pathname?.startsWith("/projects")) return null;
  if (!visible) return null;
  return (
    <section
      aria-label="Cookie banner"
      className="fixed z-[9500] flex flex-col gap-4 rounded-3xl border border-linen-border bg-white p-6 text-charcoal shadow-subtle-2 inset-x-4 bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)] md:left-auto md:right-4 md:w-72"
    >
      <div className="text-sm max-md:text-center max-md:text-pretty">
        <span>
          We use cookies to enhance your development experience and keep your data secure.{" "}
          <Link href="/privacy" className="text-sm underline">
            Privacy Policy
          </Link>
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          data-testid="consent-accept-all-button"
          data-size="default"
          onClick={() => decide("all")}
          className="btn-primitive btn-chassis btn-hit-slop relative inline-flex h-8 px-2.5 py-1.5 typestyle-control-sm rounded-2 [&_svg[data-default-size]]:size-4 w-full"
          style={{ color: "var(--fg-primary)", background: "var(--bg-translucent)" }}
        >
          <span
            aria-hidden="true"
            className="fx-layer fx-layer-fade fx-hide-on-press"
            style={{
              zIndex: -1,
              boxShadow:
                "light-dark(oklch(0 0 0 / 0.04), oklch(0 0 0 / 0.12)) 0px 2px 2px -1px, light-dark(oklch(0 0 0 / 0.02), oklch(0 0 0 / 0.12)) 0px 4px 4px -2px",
            }}
          />
          <span
            aria-hidden="true"
            className="fx-layer fx-layer-fade fx-interaction fx-touch-hidden"
            style={
              {
                zIndex: 0,
                backgroundColor: "light-dark(oklch(0 0 0), oklch(1 0 0))",
                "--_resting": 0,
                "--_hover": 0.04,
                "--_pressed": 0.06,
                "--_dark-resting": 0,
                "--_dark-hover": 0.08,
                "--_dark-pressed": 0.12,
              } as React.CSSProperties
            }
          />
          <span
            aria-hidden="true"
            className="fx-layer fx-layer-fade fx-hide-on-press"
            style={{
              zIndex: 1,
              boxShadow:
                "light-dark(oklch(1 0 0), transparent) 0px 2px 0px -1px inset, light-dark(oklch(1 0 0 / 0.8), transparent) 0px -2px 0px -1px inset",
            }}
          />
          <span
            aria-hidden="true"
            className="fx-layer"
            style={{
              zIndex: 2,
              backgroundImage:
                "linear-gradient(light-dark(transparent, oklch(1 0 0 / 0.04)), light-dark(oklch(0 0 0 / 0.04), transparent))",
            }}
          />
          <span
            aria-hidden="true"
            className="fx-layer"
            style={{
              zIndex: 3,
              boxShadow: "inset 0 0 0 var(--border-default) light-dark(oklch(0 0 0 / 0.16), oklch(1 0 0 / 0.16))",
            }}
          />
          <span
            aria-hidden="true"
            className="fx-layer fx-layer-fade fx-hide-on-press"
            style={{
              zIndex: 4,
              boxShadow:
                "light-dark(oklch(0 0 0 / 0.08), oklch(1 0 0 / 0.16)) 0px 0.5px 0px 0px inset, light-dark(oklch(0 0 0 / 0.16), oklch(1 0 0 / 0.04)) 0px -0.5px 0px 0px inset",
            }}
          />
          <span className="btn-content justify-center gap-1">
            <span className="px-0.5">Accept all</span>
          </span>
        </button>
        <div className="flex gap-2.5 max-md:flex-row md:flex-col">
          <button
            type="button"
            data-testid="consent-manage-preferences-button"
            data-size="default"
            onClick={() => decide("manage")}
            className="btn-primitive btn-chassis btn-hit-slop relative inline-flex h-8 px-2.5 py-1.5 typestyle-control-sm rounded-2 [&_svg[data-default-size]]:size-4 w-full"
            style={{ color: "var(--fg-primary)", background: "transparent" }}
          >
            <span
              aria-hidden="true"
              className="fx-layer fx-layer-fade fx-interaction fx-touch-hidden"
              style={
                {
                  zIndex: 0,
                  backgroundColor: "light-dark(oklch(0 0 0), oklch(1 0 0))",
                  "--_resting": 0,
                  "--_hover": 0.08,
                  "--_pressed": 0.1,
                  "--_dark-resting": 0,
                  "--_dark-hover": 0.12,
                  "--_dark-pressed": 0.16,
                } as React.CSSProperties
              }
            />
            <span className="btn-content justify-center gap-1">
              <span className="px-0.5">Manage preferences</span>
            </span>
          </button>
          <button
            type="button"
            data-testid="consent-reject-all-button"
            data-size="default"
            onClick={() => decide("reject")}
            className="btn-primitive btn-chassis btn-hit-slop relative inline-flex h-8 px-2.5 py-1.5 typestyle-control-sm rounded-2 [&_svg[data-default-size]]:size-4 w-full"
            style={{ color: "var(--fg-primary)", background: "transparent" }}
          >
            <span
              aria-hidden="true"
              className="fx-layer fx-layer-fade fx-interaction fx-touch-hidden"
              style={
                {
                  zIndex: 0,
                  backgroundColor: "light-dark(oklch(0 0 0), oklch(1 0 0))",
                  "--_resting": 0,
                  "--_hover": 0.08,
                  "--_pressed": 0.1,
                  "--_dark-resting": 0,
                  "--_dark-hover": 0.12,
                  "--_dark-pressed": 0.16,
                } as React.CSSProperties
              }
            />
            <span className="btn-content justify-center gap-1">
              <span className="px-0.5">Reject all</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
