import { NextResponse } from "next/server";
import { loginAdmin, logoutAdmin, isAdmin } from "@/lib/admin-auth";

export async function GET() {
  return NextResponse.json({ authenticated: await isAdmin() });
}

export async function POST(request: Request) {
  let body: { password?: string } | null = null;
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    body = null;
  }
  const ok = await loginAdmin(String(body?.password ?? ""));
  if (!ok) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
  await logoutAdmin();
  return NextResponse.json({ authenticated: false });
}
