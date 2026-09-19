import { LegalShell } from "@/components/site/inner";

export default function DoNotSellPage() {
  return (
    <LegalShell title="Do not sell or share my personal information" updated="January 2026">
      <section>
        <h2>Your choice</h2>
        <p>
          We do not sell personal information for money. If any of our analytics or advertising
          cookies count as a “sale” or “share” under California law, you can opt out here and we
          will honor Global Privacy Control signals automatically.
        </p>
      </section>
      <section>
        <h2>How to opt out</h2>
        <ul>
          <li>Toggle optional cookies off in our cookie settings.</li>
          <li>Enable Global Privacy Control in your browser.</li>
          <li>Contact support to confirm your preference in writing.</li>
        </ul>
      </section>
      <section>
        <h2>What doesn&apos;t change</h2>
        <p>
          Strictly necessary cookies for sign-in, security and billing keep working — the product
          can&apos;t function without them.
        </p>
      </section>
    </LegalShell>
  );
}
