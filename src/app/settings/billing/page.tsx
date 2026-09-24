"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/app/app-sidebar";
import { CREDITS_LIMIT, readCredits, type CreditState } from "@/lib/credits";

export default function BillingPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [credits, setCredits] = useState<CreditState | null>(null);

  // Deferred read so SSR markup matches the first paint.
  useEffect(() => {
    const t = setTimeout(() => {
      setCredits(readCredits());
      const sync = () => setCredits(readCredits());
      window.addEventListener("freebuff:credits-changed", sync);
      return () => window.removeEventListener("freebuff:credits-changed", sync);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const used = credits?.used ?? 0;
  const remaining = Math.max(0, CREDITS_LIMIT - used);

  return (
    <div className="flex min-h-screen w-full flex-col bg-parchment text-charcoal md:flex-row">
      <AppSidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((c) => !c)} />
      <main className={`flex w-full flex-1 flex-col transition-[padding] duration-200 ${collapsed ? "md:ml-16" : "md:ml-64"}`}>
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 md:px-8 md:py-14">
      <h1 className="text-3xl font-medium tracking-tight text-charcoal md:text-4xl">Billing</h1>
      <p className="mt-2 text-steel">Plan, credits and invoices for Gürkan&apos;s Freebuff.</p>

      <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-steel">Current plan</p>
            <p className="mt-0.5 text-xl font-medium text-charcoal">Free</p>
          </div>
          <Link
            href="/pricing"
            className="rounded-buttons bg-charcoal px-4 py-2 text-sm font-medium text-parchment transition-colors hover:bg-charcoal/90"
          >
            Upgrade to Pro
          </Link>
        </div>
        <div className="mt-5 border-t border-black/5 pt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-steel">Build credits left today</span>
            <span className="font-medium text-charcoal">{remaining} / {CREDITS_LIMIT}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-warm-sand">
            <div
              className="h-full rounded-full bg-charcoal transition-[width] duration-300"
              style={{ width: `${Math.min(100, (used / CREDITS_LIMIT) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[11.5px] text-dim-gray">Daily credits reset at midnight UTC.</p>
        </div>
      </div>

      <h2 id="plans" className="mt-10 scroll-mt-8 text-xl font-medium tracking-tight text-charcoal">Plans</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          {
            name: "Free",
            price: "$0",
            note: "Daily build credits, public projects, community support.",
            current: true,
          },
          {
            name: "Pro",
            price: "$25",
            note: "Higher credit limits, private projects, priority builds.",
            href: "/pricing",
          },
        ].map((plan) => (
          <div
            key={plan.name}
            className="flex flex-col rounded-2xl border border-black/10 bg-white p-5"
          >
            <div className="flex items-baseline justify-between">
              <p className="text-[15px] font-medium text-charcoal">{plan.name}</p>
              <p className="text-[13px] text-steel">
                {plan.price}
                <span className="text-dim-gray">/mo</span>
              </p>
            </div>
            <p className="mt-2 flex-1 text-[13px] leading-relaxed text-steel">{plan.note}</p>
            {plan.current ? (
              <span className="mt-4 inline-flex w-fit items-center rounded-full bg-warm-sand px-3 py-1.5 text-[12px] font-medium text-charcoal">
                Current plan
              </span>
            ) : (
              <Link
                href={plan.href ?? "/pricing"}
                className="mt-4 inline-flex w-fit items-center rounded-buttons bg-charcoal px-4 py-2 text-[13px] font-medium text-parchment transition-colors hover:bg-charcoal/90"
              >
                Upgrade
              </Link>
            )}
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-medium tracking-tight text-charcoal">Invoices</h2>
      <div className="mt-4 rounded-2xl border border-black/10 bg-white p-8 text-center">
        <p className="font-medium text-charcoal">No invoices yet</p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-steel">
          Invoices appear here once you move to a paid plan.
        </p>
      </div>
    </div>
      </main>
    </div>
  );
}
