import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  createMember,
  deleteMember,
  listMembers,
  updateMember,
  type MemberPlan,
  type MemberRole,
} from "@/lib/admin-store";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ members: await listMembers() });
}

type Body = {
  action?: "create" | "update" | "delete";
  id?: string;
  name?: string;
  email?: string;
  role?: MemberRole;
  status?: "active" | "suspended";
  plan?: MemberPlan;
  credits?: number;
};

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  switch (body.action) {
    case "create": {
      const name = String(body.name ?? "").trim();
      const email = String(body.email ?? "").trim();
      if (!name || !email.includes("@")) {
        return NextResponse.json({ error: "name and valid email required" }, { status: 400 });
      }
      const member = await createMember({ name, email, role: body.role, plan: body.plan });
      return NextResponse.json({ member }, { status: 201 });
    }
    case "update": {
      if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
      const patch: Parameters<typeof updateMember>[1] = {};
      if (body.role) patch.role = body.role;
      if (body.status) patch.status = body.status;
      if (body.plan) patch.plan = body.plan;
      if (typeof body.credits === "number") patch.credits = Math.max(0, Math.round(body.credits));
      if (body.name) patch.name = String(body.name).trim();
      if (body.email) patch.email = String(body.email).trim().toLowerCase();
      const member = await updateMember(body.id, patch);
      if (!member) return NextResponse.json({ error: "not found" }, { status: 404 });
      return NextResponse.json({ member });
    }
    case "delete": {
      if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
      const ok = await deleteMember(body.id);
      return NextResponse.json({ deleted: ok });
    }
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
