"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app/app-sidebar";

const SIDEBAR_COLLAPSED_KEY = "lovable.sidebar-collapsed";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // Restore the last choice (deferred to avoid SSR mismatch).
  React.useEffect(() => {
    const t = setTimeout(() => {
      try {
        setCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1");
      } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
      } catch {}
      // settings pages re-render their own sidebar to match
      window.dispatchEvent(new CustomEvent("lovable:sidebar-changed"));
      return next;
    });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        header, footer, #cookie-banner { display: none !important; }
        body { margin: 0; padding: 0; }
      `}} />
      <div data-dashboard className="min-h-screen bg-parchment text-charcoal tracking-tight antialiased">
        <AppSidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
        <main className={`min-h-screen transition-[padding] duration-200 ${collapsed ? "md:pl-16" : "md:pl-64"}`}>
          {children}
        </main>
      </div>
    </>
  );
}