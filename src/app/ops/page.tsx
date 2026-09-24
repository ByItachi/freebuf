import { PersonaPage } from "@/components/site/inner";
import { px } from "@/lib/img";

const CD = px("/");
const BASE = "/";

export default function OpsPage() {
  return (
    <PersonaPage
      role="ops teams"
      hero="Automate workflows and visualize data"
      sub="Reduce operational coordination overhead with tools your whole company actually uses."
      points={[
        { title: "Dashboards", desc: "Live views over the data that runs the business.", img: `${CD}/${BASE}/dashboards.webp` },
        { title: "Queues", desc: "Triage work in one place instead of five inboxes.", img: `${CD}/${BASE}/queues.webp` },
        { title: "Workflows", desc: "Approvals and handoffs that move on their own.", img: `${CD}/${BASE}/workflows.webp` },
        { title: "Knowledge", desc: "Docs and answers where the work happens.", img: `${CD}/${BASE}/knowledge.webp` },
      ]}
      useCases={[
        { title: "Operational overhead, down", desc: "Coordination that used to take meetings now takes software.", href: "/solutions/use-case/internal-tools-internal-project-management-tools", img: `${CD}/${BASE}/operational-overhead.webp` },
      ]}
      faqs={[
        { q: "Can ops teams build without engineers?", a: "Yes — describe the workflow and iterate on it like a document." },
        { q: "Does it connect to our stack?", a: "Sheets, CRMs, databases and APIs all plug straight in." },
        { q: "Is it safe for company data?", a: "SSO, roles and audit logs come standard; business data never trains models." },
      ]}
    />
  );
}
