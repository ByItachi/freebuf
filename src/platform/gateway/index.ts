type Route = { method: string; path: string; service: string };
type ApiKey = { id: string; keyHash: string; name: string; rpm: number };

const routes: Route[] = [
  { method: "POST", path: "/api/chat", service: "ai" },
  { method: "GET", path: "/api/projects", service: "data" },
  { method: "POST", path: "/api/projects", service: "data" },
  { method: "POST", path: "/api/agents/run", service: "agents" },
  { method: "POST", path: "/api/workflows/run", service: "workflow" },
  { method: "POST", path: "/api/knowledge/query", service: "knowledge" },
];

const keys = new Map<string, ApiKey>();
const hits = new Map<string, { count: number; window: number }>();

export const gateway = {
  listRoutes() {
    return routes;
  },
  registerRoute(route: Route) {
    routes.push(route);
  },
  issueKey(name: string, rpm = 60) {
    const raw = `mk_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    const keyHash = Buffer.from(raw).toString("base64");
    const id = `key_${keys.size + 1}`;
    keys.set(id, { id, keyHash, name, rpm });
    return { id, apiKey: raw, rpm };
  },
  rateLimit(keyId: string, rpm = 60): boolean {
    const now = Math.floor(Date.now() / 60000);
    const cur = hits.get(keyId);
    if (!cur || cur.window !== now) {
      hits.set(keyId, { count: 1, window: now });
      return true;
    }
    if (cur.count >= rpm) return false;
    cur.count += 1;
    return true;
  },
};