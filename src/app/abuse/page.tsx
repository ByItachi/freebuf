"use client";

import { useState } from "react";
import { InnerHero, Section } from "@/components/site/inner";

export default function AbusePage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Trust & safety"
        title="How can we help?"
        sub="Report abuse, phishing, infringement or anything that breaks our platform rules."
      />
      <Section narrow>
        <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
          {sent ? (
            <div className="py-8 text-center">
              <p className="text-2xl font-medium text-charcoal">Report received</p>
              <p className="mx-auto mt-2 max-w-md text-steel">
                Our trust &amp; safety team reviews every report, usually within two business days.
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
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-charcoal">What&apos;s wrong?</span>
                <select
                  required
                  defaultValue=""
                  className="w-full rounded-xl border border-linen-border bg-parchment px-4 py-2.5 text-[15px] text-charcoal outline-none focus:border-stone"
                >
                  <option value="" disabled>
                    Choose a reason
                  </option>
                  <option>Phishing or scam</option>
                  <option>Copyright infringement</option>
                  <option>Harassment or hate</option>
                  <option>Malware or hacking</option>
                  <option>Something else</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-charcoal">Link to the content</span>
                <input
                  required
                  type="url"
                  placeholder="https://…"
                  className="w-full rounded-xl border border-linen-border bg-parchment px-4 py-2.5 text-[15px] text-charcoal outline-none placeholder:text-charcoal/35 focus:border-stone"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-charcoal">Details</span>
                <textarea
                  required
                  rows={4}
                  placeholder="What happened, and why does it break the rules?"
                  className="w-full resize-none rounded-xl border border-linen-border bg-parchment px-4 py-2.5 text-[15px] text-charcoal outline-none placeholder:text-charcoal/35 focus:border-stone"
                />
              </label>
              <button
                type="submit"
                className="rounded-buttons bg-charcoal px-5 py-3 text-[15px] font-medium text-parchment transition-colors hover:bg-charcoal/90"
              >
                Submit report
              </button>
            </form>
          )}
        </div>
      </Section>
    </main>
  );
}
