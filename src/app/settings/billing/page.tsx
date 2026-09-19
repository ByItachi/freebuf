import Link from "next/link";
import { AppSidebar } from "@/components/app/app-sidebar";

export default function BillingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-parchment text-charcoal md:flex-row">
      <AppSidebar />
      <main className="flex w-full flex-1 flex-col md:ml-64">
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 md:px-8 md:py-14">
      <h1 className="text-3xl font-medium tracking-tight text-charcoal md:text-4xl">Billing</h1>
      <p className="mt-2 text-steel">Plan, credits and invoices for Gürkan&apos;s Lovable.</p>

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
            <span className="text-steel">Build credits left this month</span>
            <span className="font-medium text-charcoal">5 / 30</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-warm-sand">
            <div className="h-full w-1/6 rounded-full bg-charcoal" />
          </div>
        </div>
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
