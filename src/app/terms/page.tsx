import { LegalShell } from "@/components/site/inner";

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated="January 2026">
      <section>
        <h2>Introduction</h2>
        <p>
          These Terms govern your use of our AI-powered software creation platform. By creating an
          account or using the service, you agree to these Terms and our Privacy Policy.
        </p>
      </section>
      <section>
        <h2>Definitions</h2>
        <p>
          “Platform” means our websites, applications and APIs. “Content” means prompts, uploads and
          generated code. “Paid Plans” means subscriptions with fees as shown on our pricing page.
        </p>
      </section>
      <section>
        <h2>Your Account</h2>
        <p>
          You must provide accurate information and keep your credentials secure. You are responsible
          for activity under your account, including workspaces you administer.
        </p>
      </section>
      <section>
        <h2>License to Use Our Services</h2>
        <p>
          We grant you a limited, revocable, non-transferable license to use the Platform for
          building software in line with these Terms and your plan limits.
        </p>
      </section>
      <section>
        <h2>License Restrictions</h2>
        <ul>
          <li>Don&apos;t abuse, resell or scrape the service beyond fair use.</li>
          <li>Don&apos;t circumvent usage limits, access controls or billing.</li>
          <li>Don&apos;t use the service for unlawful, harmful or infringing content.</li>
        </ul>
      </section>
      <section>
        <h2>Subdomain Usage and Management</h2>
        <p>
          Published projects receive a subdomain. We may reclaim subdomains that infringe rights,
          mislead users or violate policy, with notice where reasonable.
        </p>
      </section>
      <section>
        <h2>Subscriptions, Fees, and Payments</h2>
        <p>
          Paid plans bill in advance and renew automatically until cancelled. Usage-based charges
          follow the rates in your workspace. Refunds follow our support policy.
        </p>
      </section>
      <section>
        <h2>Term, Suspension, and Termination</h2>
        <p>
          Either party may terminate per the plan terms. We may suspend accounts that breach these
          Terms or threaten platform integrity, with appeal paths described in our abuse process.
        </p>
      </section>
    </LegalShell>
  );
}
