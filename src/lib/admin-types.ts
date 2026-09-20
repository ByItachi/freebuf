import type {
  AIConfig,
  ConnectorState,
  Invoice,
  Member,
  PaymentMethod,
} from "@/lib/admin-store";

export type AdminProjectRow = {
  id: string;
  name: string;
  starred: boolean;
  shared: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  fileCount: number;
};

export type AdminOverview = {
  members: number;
  activeMembers: number;
  suspendedMembers: number;
  paidRevenue: number;
  openRevenue: number;
  connectedCount: number;
  enabledCount: number;
  ai: AIConfig;
  hasAnyProviderKey: boolean;
};

export type AdminSnapshot = {
  overview: AdminOverview;
  members: Member[];
  invoices: Invoice[];
  paymentMethods: PaymentMethod[];
  connectors: (ConnectorState & { id: string; name: string; description: string })[];
  aiProviders: { id: string; name: string; keyUrl: string }[];
  aiEnvKeyFlags: Record<string, boolean>;
  aiStoredKeyFlags: Record<string, boolean>;
  projects: AdminProjectRow[];
};
