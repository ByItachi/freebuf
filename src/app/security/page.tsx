import { CtaBand, FeatureGrid, Section } from "@/components/site/inner";
import { px } from "@/lib/img";

const CD = px("/");

const ROWS = [
  {
    img: `${CD}/img/marketing-content/landing/security/access-control.webp`,
    alt: "Access control settings",
    title: "Enterprise security controls",
    desc: "Enforce SSO and role-based access so only the right people can edit, publish or manage billing — with audit logs for every action.",
  },
  {
    img: `${CD}/img/marketing-content/landing/security/data-residency.webp`,
    alt: "Data residency options",
    title: "Choose where your data lives",
    desc: "Keep customer data in the regions your compliance requires, with encrypted connections throughout.",
  },
  {
    img: `${CD}/img/marketing-content/landing/security/continuous-monitoring.webp`,
    alt: "Continuous monitoring dashboard",
    title: "Automatic security scanning",
    desc: "Every publish is scanned for common vulnerabilities before it reaches production — protection that never sleeps.",
  },
  {
    img: `${CD}/https://storage.googleapis.com/freebuff-assets/security/ai-pentest-report.webp`,
    alt: "AI pentest report",
    title: "Tested like an attacker would",
    desc: "Independent pentests and continuous monitoring mean issues are found and fixed before they matter.",
  },
];

export default function SecurityPage() {
  return (
    <main className="bg-parchment">
      <section className="bg-marketing-muted relative mb-10 flex min-h-[720px] flex-col items-center justify-center overflow-hidden">
        <div className="absolute flex h-full w-full min-w-[1920px] justify-center">
          <svg width="1920" height="720" viewBox="0 0 1920 720" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="blur-xl md:blur-2xl">
            <g clipPath="url(#sec-clip)">
              <path d="M1420 371.267C1420 545.835 1317.69 673.676 1215.56 755.16C1164.12 796.198 1111.08 826.909 1067.21 847.499C1045.28 857.794 1025.12 865.755 1008.12 871.293C992.941 876.235 975.109 881 960 881C944.891 881 927.059 876.235 911.884 871.293C894.879 865.755 874.724 857.794 852.786 847.499C808.915 826.909 755.881 796.198 704.444 755.16C602.315 673.676 500 545.835 500 371.267V100.77C500 58.2737 526.437 20.2155 566.335 5.29417L924.112 -128.511C947.251 -137.163 972.749 -137.163 995.888 -128.511L1353.67 5.29417C1393.56 20.2155 1420 58.2737 1420 100.77V371.267Z" fill="#81CFFC" />
              <path d="M1310 371.68C1310 504.668 1232.15 602.058 1154.44 664.133C1115.31 695.397 1074.96 718.793 1041.58 734.479C1024.88 742.321 1009.55 748.386 996.61 752.605C985.064 756.37 971.496 760 960 760C948.504 760 934.936 756.37 923.39 752.605C910.452 748.386 895.116 742.321 878.424 734.479C845.044 718.793 804.692 695.397 765.556 664.133C687.848 602.058 610 504.668 610 371.68V165.612C610 133.238 630.115 104.245 660.472 92.8776L932.694 -9.05646C950.3 -15.6478 969.7 -15.6478 987.306 -9.05646L1259.53 92.8776C1289.88 104.245 1310 133.238 1310 165.612V371.68Z" fill="#4E93FF" />
              <path d="M1194.85 365.915C1194.85 454.848 1142.71 519.976 1090.66 561.488C1064.45 582.394 1037.42 598.04 1015.07 608.53C1003.89 613.774 993.614 617.83 984.948 620.651C977.215 623.169 968.127 625.596 960.427 625.596C952.727 625.596 943.64 623.169 935.906 620.651C927.24 617.83 916.968 613.774 905.788 608.53C883.431 598.04 856.403 582.394 830.19 561.488C778.142 519.976 726 454.848 726 365.915V228.112C726 206.462 739.473 187.074 759.806 179.472L942.138 111.306C953.93 106.898 966.924 106.898 978.716 111.306L1161.05 179.472C1181.38 187.074 1194.85 206.462 1194.85 228.112V365.915Z" fill="#F7F4ED" />
            </g>
            <defs><clipPath id="sec-clip"><rect width="1920" height="720" fill="white" /></clipPath></defs>
          </svg>
        </div>
        <div className="relative flex w-full flex-col items-center gap-6 px-4">
          <h1 className="leading-tighter text-5xl font-bold tracking-tighter md:text-[80px] text-center">Secure by design</h1>
          <div className="flex flex-col items-center justify-center gap-8">
            <p className="text-balance text-marketing-foreground mx-auto max-w-xl text-center">Choose where your data lives, enforce SSO and role-based access, control publishing with approvals, and keep your code and prompts out of model training.</p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <a href="https://trust.freebuff.dev/" target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center rounded-full bg-charcoal px-5 text-sm font-medium text-white">Trust center</a>
              <a href="/enterprise" className="inline-flex h-8 items-center rounded-full border border-linen-border bg-white px-5 text-sm font-medium text-charcoal">Talk to sales</a>
            </div>
          </div>
        </div>
      </section>

      <Section>
        <div className="flex flex-col gap-14 md:gap-20">
          {ROWS.map((r, i) => (
            <div
              key={r.title}
              className={`grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-12 ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
                <img src={r.img} alt={r.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
              </div>
              <div>
                <h2 className="text-2xl font-medium tracking-tight text-charcoal md:text-3xl">{r.title}</h2>
                <p className="mt-3 text-lg leading-snug text-charcoal/65">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Controls" title="Guardrails for building & publishing">
        <FeatureGrid
          items={[
            { title: "Access and control", desc: "Freebuff integrates with SAML and OIDC providers including Okta, Azure AD, and Google. SCIM supports automated provisioning and deprovisioning. Permissions are role-based and enforced server-side across viewing, editing, approving, and publishing." },
            { title: "Guardrails for building & publishing", desc: "Editing, approval, and publishing are separate permissions. Public access is controlled by role and environment settings, so teams can move quickly without risking accidental exposure." },
            { title: "Secrets are handled securely", desc: "Secrets are encrypted at rest and access-controlled by role. They are not exposed in plaintext in logs or interfaces. Access is limited to authorized environments and actions." },
            { title: "Continuous monitoring & abuse detection", desc: "Freebuff continuously monitors platform activity for misuse, anomalous behavior, and compromise. Automated systems enforce rate limits and detect abuse across users and workspaces." },
            { title: "Protected infrastructure", desc: "Freebuff Cloud is protected by web application firewall (WAF) controls, network isolation, encrypted data storage, and adaptive rate limiting at the IP, user, and workspace level." },
            { title: "Founder security", desc: "Get an audit-ready report for SOC 2, ISO 27001, and investor due diligence. A basic security scan runs automatically before every publish. Run a deep AI-powered scan on demand to analyze your full codebase." },
          ]}
        />
      </Section>

      <Section narrow eyebrow="FAQ" title="Frequently asked questions">
        <div className="mx-auto max-w-3xl space-y-2">
          {[
            { q: "Where is customer data stored?", a: "Customer data is hosted in Freebuff Cloud in supported regions including the EU, US, and Asia Pacific. Data residency is region-specific and does not move across regions by default." },
            { q: "Is customer data used to train AI?", a: "On Business and Enterprise plans: No. Customer prompts, code, and workspace data are not used to train Freebuff models. If you are on a Free or Pro plan, log in, open Account Settings → Privacy, and turn off \"Use my Freebuff content for model training\" to exclude your own data from AI model training. Where third-party AI providers are used, contractual agreements restrict training and retention of customer data." },
            { q: "Is Freebuff multi-tenant, and how is customer data isolated?", a: "Freebuff is a multi-tenant platform with logical isolation between workspaces and projects. Customer data is not accessible across accounts. Isolation controls are enforced at both the application and infrastructure layers." },
            { q: "Which subprocessors does Freebuff use?", a: "Freebuff works with a limited set of infrastructure and AI subprocessors. All subprocessors are covered under contractual data protection agreements. A current list of subprocessors is available upon request." },
            { q: "Does Freebuff access or clone our source code?", a: "No. Freebuff does not clone customer Git repositories, access application code inside your environments, or require internal CI/CD access. Your source code, repositories, and production infrastructure remain inside your organization's existing security perimeter." },
            { q: "Does Freebuff require access to our CI/CD pipelines or production infrastructure?", a: "No. Freebuff does not require direct access to customer CI/CD pipelines or production infrastructure. It does not deploy agents inside production environments or introduce inbound network connections. All integrations operate within defined permission boundaries." },
            { q: "How are publishing controls enforced?", a: "Publishing permissions are enforced server-side and cannot be bypassed via client-side requests. Editing, approval, and publishing are separate role-based permissions. Production publishing can require explicit approval, and all publishing events are logged with user attribution." },
            { q: "How does Freebuff enforce role-based access control (RBAC)?", a: "Freebuff integrates with SAML and OIDC identity providers and supports SCIM for automated provisioning and deprovisioning. Access is role-based, with permissions explicitly defined for viewing, editing, approving, and publishing. All authorization checks are evaluated server-side at request time." },
            { q: "Does Freebuff support least-privilege access?", a: "Yes. Freebuff supports least-privilege access through role-based permissions and integration with enterprise identity providers. Organizations can define granular roles for editing, approving, and publishing, ensuring users receive only the access required for their responsibilities." },
            { q: "How are secrets and API credentials managed?", a: "Secrets are encrypted at rest and scoped to specific environments. Access to secrets is role-controlled and auditable. Secrets can be rotated or revoked without requiring full system redeployment. Integrations execute within predefined permission boundaries to reduce unintended credential exposure." },
            { q: "Does Freebuff perform automated security scanning?", a: "Yes. A basic security scan runs automatically every time you publish, covering database configurations, RLS policies, and cloud project settings (~10-15 seconds). A deep security scan is available on demand and analyzes your full codebase (~3 minutes). Workspace admins can enable auto-fix to have the agent resolve non-breaking findings automatically." },
            { q: "Is Freebuff SOC 2 or GDPR compliant?", a: "Freebuff supports SOC 2 and GDPR requirements and provides security documentation and data protection agreements for enterprise review." },
          ].map((faq) => (
            <details key={faq.q} className="group rounded-xl border border-black/10 bg-white open:shadow-sm">
              <summary className="cursor-pointer list-none px-5 py-4 font-medium text-charcoal [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {faq.q}
                  <span aria-hidden="true" className="text-steel transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="px-5 pb-4 text-[15px] leading-relaxed text-steel">{faq.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <CtaBand />
    </main>
  );
}
