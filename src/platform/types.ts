export type TenantId = string;
export type WorkspaceId = string;
export type UserId = string;

export type Capability =
  | "kernel"
  | "identity"
  | "security"
  | "gateway"
  | "ai"
  | "agents"
  | "workflow"
  | "knowledge"
  | "memory"
  | "data"
  | "messaging"
  | "search"
  | "developer"
  | "infra"
  | "observability"
  | "governance"
  | "llmops"
  | "runtime"
  | "control"
  | "twin"
  | "autonomy"
  | "fabric";

export type PlatformContext = {
  tenantId: TenantId;
  workspaceId: WorkspaceId;
  userId: UserId;
  roles: string[];
  region?: string;
};

export type Result<T> = { ok: true; data: T } | { ok: false; error: string; code?: string };