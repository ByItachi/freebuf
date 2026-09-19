type Policy = { id: string; name: string; rule: string; enabled: boolean };

const policies: Policy[] = [
  { id: "p-tenant-isolation", name: "Tenant isolation", rule: "deny.cross_tenant", enabled: true },
  { id: "p-ai-safe", name: "AI safety defaults", rule: "require.safety_scan", enabled: true },
  { id: "p-cost-cap", name: "Daily AI cost cap", rule: "limit.tokens.daily=2e6", enabled: true },
  { id: "p-audit", name: "Audit all mutations", rule: "require.audit", enabled: true },
];

export const governance = {
  listPolicies() {
    return policies;
  },
  evaluate(action: string) {
    const active = policies.filter((p) => p.enabled);
    return { allowed: true, action, matched: active.map((p) => p.id) };
  },
};