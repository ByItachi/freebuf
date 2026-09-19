import { kernel } from "../kernel";
import { observability } from "../observability";
import { infra } from "../infra";
import { governance } from "../governance";

export const controlCenter = {
  missionControl() {
    return {
      kernel: kernel.status(),
      infra: infra.status(),
      observability: observability.snapshot().slo,
      governance: governance.listPolicies().filter((p) => p.enabled).map((p) => p.id),
      generatedAt: new Date().toISOString(),
    };
  },
};