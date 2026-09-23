import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  adminOverview,
  listAudit,
  listMembers,
  listInvoices,
  listPaymentMethods,
  listConnectorStates,
  providerKeyFlags,
} from "@/lib/admin-store";
import { listProjects } from "@/lib/store";
import { PROVIDERS } from "@/lib/models";

/** Everything the admin overview page needs, in one shot. */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [overview, members, invoices, paymentMethods, connectors, projects, storedKeyFlags, auditLog] =
    await Promise.all([
      adminOverview(),
      listMembers(),
      listInvoices(),
      listPaymentMethods(),
      listConnectorStates(),
      listProjects(),
      providerKeyFlags(),
      listAudit(),
    ]);

  return NextResponse.json({
    overview,
    members,
    invoices,
    paymentMethods,
    connectors,
    aiProviders: PROVIDERS.map((p) => ({ id: p.id, name: p.name, keyUrl: p.keyUrl })),
    aiEnvKeyFlags: Object.fromEntries(
      PROVIDERS.map((p) => [p.id, Boolean(p.envKey && process.env[p.envKey])]),
    ),
    aiStoredKeyFlags: storedKeyFlags,
    auditLog,
    projects: projects.map((p) => ({
      id: p.id,
      name: p.name,
      starred: p.starred,
      shared: p.shared,
      published: p.published,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      messageCount: p.messages.length,
      fileCount: p.files.length,
    })),
  });
}
