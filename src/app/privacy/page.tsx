import { LegalShell } from "@/components/site/inner";

export default function PrivacyPage() {
  return (
    <LegalShell title="Lovable Privacy Policy" updated="January 2026">
      <section>
        <h2>What we collect</h2>
        <p>
          Account details you provide, prompts and project content you create, and technical data
          (device, usage, diagnostics) needed to run and improve the service.
        </p>
      </section>
      <section>
        <h2>How we use it</h2>
        <ul>
          <li>Operate, secure and support your projects and workspaces.</li>
          <li>Improve generation quality and fix issues.</li>
          <li>Bill plans and communicate important changes.</li>
        </ul>
      </section>
      <section>
        <h2>Training &amp; AI models</h2>
        <p>
          Business and Enterprise plan data is not used to train models. Free-tier content may be
          used in aggregated, de-identified form to improve the service unless you opt out.
        </p>
      </section>
      <section>
        <h2>Sharing &amp; subprocessors</h2>
        <p>
          We share data with infrastructure subprocessors under data processing agreements, and never
          sell personal information. A current subprocessor list is published on our site.
        </p>
      </section>
      <section>
        <h2>Your rights</h2>
        <p>
          Access, correct, export or delete your data any time from settings or by contacting us.
          California and EU residents have additional rights described in our DPA and regional notices.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Privacy questions go to our support team via the help center. We respond within statutory
          timeframes.
        </p>
      </section>
    </LegalShell>
  );
}
