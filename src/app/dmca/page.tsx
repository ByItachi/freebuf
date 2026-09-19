import { LegalShell } from "@/components/site/inner";

export default function DmcaPage() {
  return (
    <LegalShell title="DMCA Copyright Policy" updated="January 2026">
      <section>
        <h2>Filing a notice</h2>
        <p>
          If you believe content on the platform infringes your copyright, send a notice with
          identification of the work, the infringing material&apos;s location, your contact details
          and a good-faith statement — plus your physical or electronic signature.
        </p>
      </section>
      <section>
        <h2>Counter-notices</h2>
        <p>
          If your content was removed by mistake, you may file a counter-notice with the same
          details plus consent to jurisdiction. We restore content per statutory timelines unless
          the complainant files court action.
        </p>
      </section>
      <section>
        <h2>Repeat infringers</h2>
        <p>
          Accounts that repeatedly infringe are suspended or terminated under our platform rules.
        </p>
      </section>
    </LegalShell>
  );
}
