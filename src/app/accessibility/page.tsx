import { LegalShell } from "@/components/site/inner";

export default function AccessibilityPage() {
  return (
    <LegalShell title="Accessibility" updated="January 2026">
      <section>
        <h2>Our commitment</h2>
        <p>
          Everyone should be able to build and use software. We design to WCAG 2.2 AA: keyboard
          navigation, visible focus, sufficient contrast and screen-reader labels across the product.
        </p>
      </section>
      <section>
        <h2>Building accessibly</h2>
        <p>
          Apps you publish inherit accessible defaults — semantic landmarks, labeled controls and
          focus management. Describe accessibility needs in your prompts (e.g. “large text, high
          contrast”) and the agent applies them.
        </p>
      </section>
      <section>
        <h2>Feedback</h2>
        <p>
          Hit a barrier? Tell support exactly where — page, action and assistive tech — and
          we&apos;ll prioritize a fix.
        </p>
      </section>
    </LegalShell>
  );
}
