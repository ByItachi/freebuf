"use client";

import React from "react";
import { AppSidebar } from "@/components/app/app-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        header, footer, #cookie-banner { display: none !important; }
        body { margin: 0; padding: 0; }
      `}} />
      <div data-dashboard className="min-h-screen bg-parchment text-charcoal tracking-tight antialiased">
        <AppSidebar />
        <main className="min-h-screen md:pl-64">{children}</main>
      </div>
    </>
  );
}