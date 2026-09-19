import { NextResponse } from "next/server";
import { platform } from "@/platform";

export async function GET() {
  return NextResponse.json({ workflows: platform.workflow.list() });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const workflowId = String(body.workflowId ?? "build-ship");
  const autoApprove = body.autoApprove !== false;
  const result = await platform.workflow.start(workflowId, autoApprove);
  platform.messaging.publish("workflows.runs", result);
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}