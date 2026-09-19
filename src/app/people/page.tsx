import { PersonaPage } from "@/components/site/inner";

const CD = "https://lovable.dev/cdn-cgi/image/width=640,f=auto,fit=scale-down";
const BASE = "https://assets.lovable.dev/img/marketing-content/audiences/people/hero";

export default function PeoplePage() {
  return (
    <PersonaPage
      role="people teams"
      hero="Build employee resource hubs"
      sub="Make people ops scalable — onboarding, directories, time-off and answers in one hub."
      gallery={[1, 2, 3, 4, 5, 6].map((n) => ({
        src: `${CD}/${BASE}/person-${n}.webp`,
        alt: `People team member ${n}`,
      }))}
      points={[
        { title: "Onboarding flows", desc: "Day-one checklists and buddy intros that run themselves." },
        { title: "People directories", desc: "Find anyone, any team, any skill — searchable and current." },
        { title: "Time-off & requests", desc: "Approvals without the spreadsheet chase." },
        { title: "Policy hubs", desc: "Handbooks people actually read and search." },
      ]}
      useCases={[
        { title: "Onboarding portals", desc: "Role-based first weeks for every hire.", href: "/solutions/use-case/internal-tools-hiring-softwares" },
        { title: "HR dashboards", desc: "Headcount, turnover and engagement at a glance.", href: "/solutions/use-case/dashboard-data-visualization-dashboards" },
      ]}
      faqs={[
        { q: "Can HR build without engineers?", a: "Yes — describe the hub and iterate on it like a document." },
        { q: "Is employee data safe?", a: "SSO, roles and audit logs come standard; business data never trains models." },
        { q: "Does it integrate with HRIS?", a: "APIs and CSV syncs keep directories and records current." },
      ]}
    />
  );
}
