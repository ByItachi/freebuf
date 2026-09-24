import { LegalShell } from "@/components/site/inner";

export default function PlatformRulesPage() {
  return (
    <LegalShell title="Platform Rules" updated="January 2026">
      <section>
        <h2>Build, don&apos;t harm</h2>
        <p>
          Freebuff is for creating software. Don&apos;t use it for phishing, malware, spam,
          harassment, deception or anything illegal — including circumventing usage limits.
        </p>
      </section>
      <section>
        <h2>Respect rights</h2>
        <p>
          Only upload content you have rights to, and don&apos;t impersonate people, brands or
          public services. Parody and commentary should be clearly labeled.
        </p>
      </section>
      <section>
        <h2>Enforcement &amp; appeals</h2>
        <ul>
          <li>Violations can lead to warnings, unpublished projects or account suspension.</li>
          <li>Serious or repeated violations lead to termination.</li>
          <li>You can appeal any action from your account — we review every appeal.</li>
        </ul>
      </section>
    </LegalShell>
  );
}
