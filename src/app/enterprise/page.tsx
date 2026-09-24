"use client";

import { useState } from "react";
import Link from "next/link";
import { Section } from "@/components/site/inner";
import { px } from "@/lib/img";

const LOGOS = ["Nursa", "Backchannel", "Plinq", "DeliveryHero", "Thinkific", "Sentry"];

export default function EnterprisePage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="bg-parchment">
      <section className="bg-marketing-background relative mb-10 flex min-h-[720px] flex-col items-center overflow-hidden">
        <div className="absolute h-full w-full min-w-[1920px]">
          <img
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            sizes="100vw"
            srcSet={`${px("/")} 640w, ${px("/")} 750w, ${px("/")} 828w, ${px("/")} 1080w, ${px("/")} 1920w, ${px("/")} 3840w`}
            src={px("/")}
          />
        </div>
        <div className="relative mt-[180px] flex w-full flex-col items-center gap-6 px-4">
          <div className="font-medium text-xl leading-tight tracking-tight">Freebuff for enterprises</div>
          <div className="py-5">
            <h1 className="leading-tighter inline-flex text-center text-7xl font-bold tracking-tighter md:text-[120px] lg:text-[160px]">
              <span className="inline-block">Ship</span>{" "}
              <span className="pointer-events-none relative z-10 inline-block w-10 select-none md:w-20">
                <span className="absolute inset-0">
                  <span className="absolute -top-[18px] -right-10 inline-block h-[450px] w-[650px] opacity-70 md:-top-6 md:-right-16 md:h-[932px] md:w-[1323px] md:opacity-100">
                    <img
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="eager"
                      fetchPriority="high"
                      decoding="sync"
                      sizes="100vw"
                      srcSet={`${px("/")} 640w, ${px("/")} 1920w, ${px("/")} 3840w`}
                      src={px("/")}
                    />
                  </span>
                  <span className="absolute -top-5 -left-5 inline-block h-[90px] w-[90px] md:-top-8 md:-left-10 md:h-[181px] md:w-[179px]">
                    <img
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="eager"
                      fetchPriority="high"
                      decoding="sync"
                      sizes="100vw"
                      srcSet={`${px("/")} 640w, ${px("/")} 1920w, ${px("/")} 3840w`}
                      src={px("/")}
                    />
                  </span>
                </span>
              </span>
              <span className="inline-block">faster</span>
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center gap-8">
            <p className="text-balance text-center text-marketing-foreground mx-auto max-w-[460px] text-sm leading-tight font-medium tracking-tight sm:text-xl">
              Prototype faster, validate early, and ship internal tools and production apps without waiting on engineering.
            </p>
            <Link
              href="/enterprise-form"
              className="inline-flex h-8 items-center rounded-full bg-charcoal px-5 text-sm font-medium text-white transition-colors hover:bg-charcoal/90"
            >
              Get a demo
            </Link>
          </div>
        </div>
      </section>

      <Section eyebrow="Trusted in production" title="Join other companies building with Freebuff">
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
          <img
            src={px("/")}
            alt="Companies building with Freebuff"
            loading="lazy"
            decoding="async"
            className="w-full object-cover"
          />
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {LOGOS.map((l) => (
            <span key={l} className="text-lg font-medium text-charcoal/40">
              {l}
            </span>
          ))}
        </div>
      </Section>

      <Section narrow>
        <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
          {sent ? (
            <div className="py-8 text-center">
              <p className="text-2xl font-medium text-charcoal">Request received</p>
              <p className="mx-auto mt-2 max-w-md text-steel">
                Our sales team will reach out within one business day to schedule your demo.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="grid grid-cols-1 gap-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-charcoal">First name *</span>
                  <input
                    required
                    placeholder="Ada"
                    className="w-full rounded-xl border border-linen-border bg-parchment px-4 py-2.5 text-[15px] text-charcoal outline-none placeholder:text-charcoal/35 focus:border-stone"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-charcoal">Last name *</span>
                  <input
                    required
                    placeholder="Lovelace"
                    className="w-full rounded-xl border border-linen-border bg-parchment px-4 py-2.5 text-[15px] text-charcoal outline-none placeholder:text-charcoal/35 focus:border-stone"
                  />
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-charcoal">Work email *</span>
                <input
                  required
                  type="email"
                  placeholder="ada@company.com"
                  className="w-full rounded-xl border border-linen-border bg-parchment px-4 py-2.5 text-[15px] text-charcoal outline-none placeholder:text-charcoal/35 focus:border-stone"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-charcoal">Phone number (+1)</span>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-xl border border-linen-border bg-parchment px-4 py-2.5 text-[15px] text-charcoal outline-none placeholder:text-charcoal/35 focus:border-stone"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-charcoal">Company&apos;s website *</span>
                <input
                  required
                  type="url"
                  placeholder="https://company.com"
                  className="w-full rounded-xl border border-linen-border bg-parchment px-4 py-2.5 text-[15px] text-charcoal outline-none placeholder:text-charcoal/35 focus:border-stone"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-charcoal">
                  What problems are you trying to solve with Freebuff?
                </span>
                <textarea
                  rows={4}
                  placeholder="Internal tools, customer portals, prototypes..."
                  className="w-full resize-none rounded-xl border border-linen-border bg-parchment px-4 py-2.5 text-[15px] text-charcoal outline-none placeholder:text-charcoal/35 focus:border-stone"
                />
              </label>
              <button
                type="submit"
                className="rounded-buttons bg-charcoal px-5 py-3 text-[15px] font-medium text-parchment transition-colors hover:bg-charcoal/90"
              >
                Submit
              </button>
              <p className="text-center text-[13px] text-steel">
                We&apos;ll use the information you share to reach out about freebuff.dev products and services. You can unsubscribe at any time. For details on how we protect your data, check out our{" "}
                <Link href="/privacy" className="underline">
                  Privacy policy
                </Link>
                .
              </p>
            </form>
          )}
        </div>
      </Section>
    </main>
  );
}
