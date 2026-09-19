import { LegalShell } from "@/components/site/inner";

export default function SecurityIssuesPage() {
  return (
    <LegalShell title="Report Security Concerns" updated="January 2026">
      <section>
        <h2>How to report</h2>
        <p>
          Found a vulnerability? Email our security team with steps to reproduce, impact and any
          proof-of-concept. Please avoid accessing other users&apos; data or disrupting the service
          while testing.
        </p>
      </section>
      <section>
        <h2>What happens next</h2>
        <ul>
          <li>We acknowledge reports within two business days.</li>
          <li>We triage, fix and keep you posted on timelines.</li>
          <li>Coordinated disclosure: please give us reasonable time before going public.</li>
        </ul>
      </section>
      <section>
        <h2>Scope</h2>
        <p>
          In scope: our websites, APIs and hosted apps. Out of scope: third-party services,
          social engineering and physical attacks.
        </p>
      </section>
    </LegalShell>
  );
}
