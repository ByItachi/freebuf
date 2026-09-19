type Connector = { id: string; protocol: string; endpoint: string; status: "up" | "down" };

const connectors: Connector[] = [
  { id: "http-local", protocol: "https", endpoint: "http://localhost:3000", status: "up" },
  { id: "ollama", protocol: "http", endpoint: "http://localhost:11434", status: "down" },
  { id: "webhooks", protocol: "webhook", endpoint: "/api/platform/webhooks", status: "up" },
];

export const integrationFabric = {
  list() {
    return connectors;
  },
  translate(from: string, to: string, payload: unknown) {
    return { from, to, payload, translated: true };
  },
  federateApis() {
    return [
      { name: "chat", path: "/api/chat" },
      { name: "projects", path: "/api/projects" },
      { name: "platform", path: "/api/platform/status" },
    ];
  },
};