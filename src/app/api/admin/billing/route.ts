import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  createInvoice,
  createPaymentMethod,
  deleteInvoice,
  deletePaymentMethod,
  listInvoices,
  listPaymentMethods,
  recordAudit,
  updateInvoice,
  updatePaymentMethod,
} from "@/lib/admin-store";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const [invoices, paymentMethods] = await Promise.all([listInvoices(), listPaymentMethods()]);
  return NextResponse.json({ invoices, paymentMethods });
}

type Body = {
  action?:
    | "invoice.create"
    | "invoice.update"
    | "invoice.delete"
    | "pm.create"
    | "pm.update"
    | "pm.delete";
  id?: string;
  memberId?: string;
  amount?: number;
  description?: string;
  status?: "paid" | "open" | "void";
  brand?: "visa" | "mastercard" | "amex";
  last4?: string;
  expMonth?: number;
  expYear?: number;
  isDefault?: boolean;
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
    case "invoice.create": {
      if (!body.memberId || typeof body.amount !== "number") {
        return NextResponse.json({ error: "memberId and amount required" }, { status: 400 });
      }
      const invoice = await createInvoice({
        memberId: body.memberId,
        amount: body.amount,
        description: body.description,
        status: body.status,
      });
      await recordAudit({
        action: "invoice.create",
        description: `Fatura oluşturuldu: ${invoice.number} — $${invoice.amount}`,
        metadata: { invoiceId: invoice.id, memberId: invoice.memberId },
      });
      return NextResponse.json({ invoice }, { status: 201 });
    }
    case "invoice.update": {
      if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
      const invoice = await updateInvoice(body.id, { status: body.status });
      if (!invoice) return NextResponse.json({ error: "not found" }, { status: 404 });
      await recordAudit({
        action: "invoice.update",
        description: `Fatura güncellendi: ${invoice.number} → ${invoice.status}`,
        metadata: { invoiceId: invoice.id, status: invoice.status },
      });
      return NextResponse.json({ invoice });
    }
    case "invoice.delete": {
      if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
      const ok = await deleteInvoice(body.id);
      if (ok) {
        await recordAudit({
          action: "invoice.delete",
          description: `Fatura silindi: ${body.id}`,
          metadata: { invoiceId: body.id },
        });
      }
      return NextResponse.json({ deleted: ok });
    }
    case "pm.create": {
      if (!body.memberId || !body.brand || !body.last4) {
        return NextResponse.json({ error: "memberId, brand and last4 required" }, { status: 400 });
      }
      const pm = await createPaymentMethod({
        memberId: body.memberId,
        brand: body.brand,
        last4: body.last4,
        expMonth: Number(body.expMonth ?? 12),
        expYear: Number(body.expYear ?? new Date().getFullYear() + 3),
        isDefault: body.isDefault,
      });
      return NextResponse.json({ paymentMethod: pm }, { status: 201 });
    }
    case "pm.update": {
      if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
      const pm = await updatePaymentMethod(body.id, { isDefault: body.isDefault });
      if (!pm) return NextResponse.json({ error: "not found" }, { status: 404 });
      return NextResponse.json({ paymentMethod: pm });
    }
    case "pm.delete": {
      if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
      return NextResponse.json({ deleted: await deletePaymentMethod(body.id) });
    }
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
