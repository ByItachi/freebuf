import type { Capability, PlatformContext } from "../types";

const CAPABILITIES: Capability[] = [
  "kernel","identity","security","gateway","ai","agents","workflow","knowledge","memory",
  "data","messaging","search","developer","infra","observability","governance","llmops",
  "runtime","control","twin","autonomy","fabric",
];

const registry = new Map<string, unknown>();

export const kernel = {
  name: "Manus Platform Kernel",
  version: "15.0.0",
  capabilities: CAPABILITIES,
  register<T>(name: string, impl: T) {
    registry.set(name, impl);
    return impl;
  },
  resolve<T>(name: string): T | null {
    return (registry.get(name) as T) ?? null;
  },
  defaultContext(): PlatformContext {
    return {
      tenantId: "tenant-default",
      workspaceId: "ws-default",
      userId: "user-local",
      roles: ["owner", "builder", "admin"],
      region: "local",
    };
  },
  status() {
    return {
      kernel: this.name,
      version: this.version,
      capabilities: this.capabilities,
      registered: [...registry.keys()],
      healthy: true,
      phase: 15,
    };
  },
};