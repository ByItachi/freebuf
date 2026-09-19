"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";
import { CookieBanner } from "./cookie-banner";

// App-shell routes render their own chrome (sidebar/header of their own) —
// the marketing header/footer/cookie banner must stay out of the way there.
const CHROME_HIDDEN_ROUTES = [
  /^\/new(?:\/|$)/,
  /^\/dashboard(?:\/|$)/,
  /^\/projects\/[^/]+(?:\/|$)/,
  /^\/login(?:\/|$)/,
];

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const hideChrome = CHROME_HIDDEN_ROUTES.some((re) => re.test(pathname));

  return (
    <>
      {hideChrome ? null : <Header />}
      <main className="flex-1">{children}</main>
      {hideChrome ? null : <Footer />}
      <CookieBanner />
    </>
  );
}
