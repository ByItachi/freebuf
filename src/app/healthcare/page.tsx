import { CtaBand, Faq, InnerHero, Section } from "@/components/site/inner";
import { px } from "@/lib/img";

const CD = px("/");
const BASE = "/";

const SHOTS = [
  { img: `${CD}/${BASE}/quality-and-outcomes-tracker.png`, title: "Quality & outcomes tracker" },
  { img: `${CD}/${BASE}/blood-tests-app.png`, title: "Blood tests app" },
  { img: `${CD}/${BASE}/triaging-frontline-staff.png`, title: "Triaging frontline staff" },
];

export default function HealthcarePage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Industries"
        title="Build Healthcare Apps Without Code"
        sub="Patient-facing tools and internal systems — with the security posture healthcare demands."
        primary={{ label: "Start building", href: "/new" }}
        secondary={{ label: "Talk to sales", href: "/enterprise" }}
      />
      <Section eyebrow="In production" title="Examples of Apps Built with Freebuff">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {SHOTS.map((s) => (
            <div key={s.title} className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
              <img src={s.img} alt={s.title} loading="lazy" decoding="async" className="aspect-[9/12] w-full object-cover object-top" />
              <p className="p-4 font-medium text-charcoal">{s.title}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section narrow eyebrow="FAQ" title="Start Building Today">
        <Faq
          items={[
            { q: "Is Freebuff suitable for patient data?", a: "Business and enterprise plans add SSO, audit logs, data residency and no-training guarantees — talk to sales about regulated workloads." },
            { q: "Can I integrate with existing systems?", a: "Yes. APIs, HL7/FHIR gateways and CSV imports all plug into your builds." },
            { q: "How fast can we prototype?", a: "Most teams demo a working intake flow within days of the first prompt." },
          ]}
        />
      </Section>
      <CtaBand />
    </main>
  );
}
