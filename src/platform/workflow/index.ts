import { randomUUID } from "crypto";
import type { Result } from "../types";

export type WorkflowNode = { id: string; type: "task" | "approval" | "agent" | "delay"; name: string };
export type Workflow = { id: string; name: string; nodes: WorkflowNode[] };
export type WorkflowRun = {
  id: string;
  workflowId: string;
  status: "pending" | "running" | "waiting_approval" | "done" | "failed";
  history: Array<{ nodeId: string; status: string; at: string }>;
};

const workflows = new Map<string, Workflow>([
  [
    "build-ship",
    {
      id: "build-ship",
      name: "Build → Review → Ship",
      nodes: [
        { id: "n1", type: "agent", name: "Generate app" },
        { id: "n2", type: "task", name: "Run checks" },
        { id: "n3", type: "approval", name: "Human approval" },
        { id: "n4", type: "task", name: "Publish preview" },
      ],
    },
  ],
]);

const runs = new Map<string, WorkflowRun>();

export const workflowEngine = {
  list() {
    return [...workflows.values()];
  },
  async start(workflowId: string, autoApprove = true): Promise<Result<WorkflowRun>> {
    const wf = workflows.get(workflowId);
    if (!wf) return { ok: false, error: "workflow not found", code: "NOT_FOUND" };
    const run: WorkflowRun = {
      id: randomUUID(),
      workflowId,
      status: "running",
      history: [],
    };
    for (const node of wf.nodes) {
      if (node.type === "approval" && !autoApprove) {
        run.status = "waiting_approval";
        run.history.push({ nodeId: node.id, status: "waiting", at: new Date().toISOString() });
        runs.set(run.id, run);
        return { ok: true, data: run };
      }
      run.history.push({ nodeId: node.id, status: "done", at: new Date().toISOString() });
    }
    run.status = "done";
    runs.set(run.id, run);
    return { ok: true, data: run };
  },
  getRun(id: string) {
    return runs.get(id) ?? null;
  },
};