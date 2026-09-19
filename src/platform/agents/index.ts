import { randomUUID } from "crypto";
import type { Result } from "../types";

export type AgentTool = { id: string; name: string; description: string };
export type Agent = {
  id: string;
  name: string;
  role: string;
  tools: string[];
  memory: string[];
  status: "idle" | "running" | "done" | "error";
};

export type AgentRun = {
  id: string;
  agentId: string;
  input: string;
  steps: Array<{ tool: string; output: string; at: string }>;
  output: string;
  status: "running" | "done" | "error";
};

const tools: AgentTool[] = [
  { id: "web.search", name: "Web Search", description: "Search public web knowledge" },
  { id: "code.generate", name: "Code Generate", description: "Generate UI/code scaffolds" },
  { id: "files.read", name: "Read Files", description: "Read project files" },
  { id: "files.write", name: "Write Files", description: "Write project files" },
  { id: "preview.render", name: "Preview Render", description: "Refresh live preview HTML" },
];

const agents = new Map<string, Agent>([
  [
    "builder",
    {
      id: "builder",
      name: "Builder Agent",
      role: "Turns prompts into product UI and code",
      tools: ["code.generate", "files.write", "preview.render"],
      memory: [],
      status: "idle",
    },
  ],
  [
    "researcher",
    {
      id: "researcher",
      name: "Research Agent",
      role: "Gathers requirements and references",
      tools: ["web.search", "files.read"],
      memory: [],
      status: "idle",
    },
  ],
]);

const runs = new Map<string, AgentRun>();

export const agentPlatform = {
  listAgents() {
    return [...agents.values()];
  },
  listTools() {
    return tools;
  },
  async run(agentId: string, input: string): Promise<Result<AgentRun>> {
    const agent = agents.get(agentId);
    if (!agent) return { ok: false, error: "agent not found", code: "NOT_FOUND" };
    agent.status = "running";
    const run: AgentRun = {
      id: randomUUID(),
      agentId,
      input,
      steps: [],
      output: "",
      status: "running",
    };
    for (const toolId of agent.tools) {
      const tool = tools.find((t) => t.id === toolId)!;
      const output =
        toolId === "code.generate"
          ? `Generated scaffold for: ${input.slice(0, 120)}`
          : toolId === "preview.render"
            ? "Preview refreshed"
            : `${tool.name} completed`;
      run.steps.push({ tool: toolId, output, at: new Date().toISOString() });
      agent.memory.push(`${toolId}: ${input.slice(0, 80)}`);
    }
    run.output = `Agent ${agent.name} finished ${run.steps.length} steps for: ${input}`;
    run.status = "done";
    agent.status = "done";
    runs.set(run.id, run);
    return { ok: true, data: run };
  },
  getRun(id: string) {
    return runs.get(id) ?? null;
  },
};