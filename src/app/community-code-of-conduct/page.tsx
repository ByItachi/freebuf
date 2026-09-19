import { LegalShell } from "@/components/site/inner";

export default function CodeOfConductPage() {
  return (
    <LegalShell title="Community Code of Conduct" updated="January 2026">
      <section>
        <h2>Be kind, build together</h2>
        <p>
          Our community runs on generosity: share what you learn, credit what you remix, and assume
          good intent. Harassment, hate, spam and deception have no home here.
        </p>
      </section>
      <section>
        <h2>What&apos;s expected</h2>
        <ul>
          <li>Welcome newcomers and answer with patience.</li>
          <li>Share real builds, feedback and lessons — not hype or scams.</li>
          <li>Respect privacy: no doxxing, no unwanted DMs, no scraping members.</li>
        </ul>
      </section>
      <section>
        <h2>Enforcement</h2>
        <p>
          Moderators may warn, mute or remove members who break these rules, with appeals reviewed
          by the community team. Serious violations lead to permanent removal.
        </p>
      </section>
    </LegalShell>
  );
}
