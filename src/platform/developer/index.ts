export const developer = {
  sdk: {
    name: "@manus/platform-sdk",
    version: "15.0.0",
    modules: ["agents", "workflow", "knowledge", "ai", "projects"],
  },
  templates: [
    { id: "saas-landing", title: "SaaS Landing" },
    { id: "admin-dashboard", title: "Admin Dashboard" },
    { id: "ai-chat", title: "AI Chat Widget" },
  ],
  openApiPaths: [
    "/api/chat",
    "/api/projects",
    "/api/platform/status",
    "/api/agents/run",
    "/api/workflows/run",
    "/api/knowledge/query",
  ],
};