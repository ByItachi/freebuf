import { LegalShell } from "@/components/site/inner";

export default function DpaPage() {
  return (
    <LegalShell title="Data Processing Agreement" updated="January 2026">
      <section>
        <h2>Scope</h2>
        <p>
          This DPA applies where we process personal data on your behalf as a processor. It works
          together with our Privacy Policy, security documentation and your order.
        </p>
      </section>
      <section>
        <h2>Security measures</h2>
        <ul>
          <li>Encryption in transit and at rest, isolated project environments.</li>
          <li>SSO, role-based access and audit logging on business plans.</li>
          <li>Continuous monitoring, scanning and incident response.</li>
        </ul>
      </section>
      <section>
        <h2>Subprocessors &amp; transfers</h2>
        <p>
          We use vetted infrastructure subprocessors listed on our site, with SCCs for
          international transfers where required. We notify customers of material changes.
        </p>
      </section>
      <section>
        <h2>Your rights</h2>
        <p>
          We help you answer data-subject requests with export and deletion tooling, and notify you
          of personal data breaches without undue delay.
        </p>
      </section>
    </LegalShell>
  );
}
