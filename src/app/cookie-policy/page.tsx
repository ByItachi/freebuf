import { LegalShell } from "@/components/site/inner";

export default function CookiePolicyPage() {
  return (
    <LegalShell title="Cookie Policy" updated="January 2026">
      <section>
        <h2>What cookies do</h2>
        <p>
          Cookies keep you signed in, remember preferences and help us understand how the product is
          used. You can control them any time from your browser or our cookie settings.
        </p>
      </section>
      <section>
        <h2>Strictly necessary</h2>
        <p>
          Authentication, security and load-balancing cookies required for the site to function.
          These cannot be disabled without breaking core features.
        </p>
      </section>
      <section>
        <h2>Preferences &amp; analytics</h2>
        <p>
          Optional cookies remember theme and editor settings, and measure aggregated usage so we
          can improve flows. They never include prompt content on paid plans.
        </p>
      </section>
      <section>
        <h2>Managing choices</h2>
        <p>
          Use the cookie banner&apos;s settings link to change consent, or clear cookies in your
          browser. Note that signing out and back in may be required after clearing auth cookies.
        </p>
      </section>
    </LegalShell>
  );
}
