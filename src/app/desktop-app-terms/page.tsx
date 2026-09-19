import { LegalShell } from "@/components/site/inner";

export default function DesktopAppTermsPage() {
  return (
    <LegalShell title="Desktop App Terms" updated="January 2026">
      <section>
        <h2>License</h2>
        <p>
          We grant you a personal, non-transferable license to install and use the desktop app on
          devices you own or control, subject to the General Terms.
        </p>
      </section>
      <section>
        <h2>Updates</h2>
        <p>
          The app updates automatically to keep builds secure and compatible. Continued use after an
          update means you accept the current terms.
        </p>
      </section>
      <section>
        <h2>Acceptable use</h2>
        <p>
          Don&apos;t reverse-engineer, redistribute or misuse the app. The same platform rules and
          abuse process apply on desktop.
        </p>
      </section>
    </LegalShell>
  );
}
