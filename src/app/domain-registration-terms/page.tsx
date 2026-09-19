import { LegalShell } from "@/components/site/inner";

export default function DomainTermsPage() {
  return (
    <LegalShell title="Domain Name Registration Terms" updated="January 2026">
      <section>
        <h2>Registration service</h2>
        <p>
          When you register a domain through us, you work with our accredited registrar partners.
          You are the registrant of record and must keep contact details accurate.
        </p>
      </section>
      <section>
        <h2>Fees &amp; renewal</h2>
        <p>
          Domains bill yearly in advance and auto-renew until cancelled. Expired domains follow the
          registry&apos;s grace and redemption timelines.
        </p>
      </section>
      <section>
        <h2>Disputes &amp; takedowns</h2>
        <p>
          Trademark disputes follow the UDRP or applicable registry policy. Domains used for abuse,
          phishing or illegality may be suspended under our platform rules.
        </p>
      </section>
    </LegalShell>
  );
}
