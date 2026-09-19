type Node = { id: string; kind: string; label: string };
type Edge = { from: string; to: string; kind: string };

const nodes: Node[] = [
  { id: "web", kind: "service", label: "Next.js App" },
  { id: "api", kind: "service", label: "API Routes" },
  { id: "ai", kind: "service", label: "AI Gateway" },
  { id: "store", kind: "data", label: "Project Store" },
];
const edges: Edge[] = [
  { from: "web", to: "api", kind: "http" },
  { from: "api", to: "ai", kind: "invoke" },
  { from: "api", to: "store", kind: "persist" },
];

export const digitalTwin = {
  topology() {
    return { nodes, edges };
  },
  whatIf(change: string) {
    return {
      change,
      impact: ["latency+5%", "error_rate stable", "capacity ok"],
      recommendation: "safe to proceed",
    };
  },
};