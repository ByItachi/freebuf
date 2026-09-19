"use client";

import { useEffect, useState } from "react";

type Status = {
  brand?: string;
  kernel?: { version?: string; capabilities?: string[]; registered?: string[]; phase?: number };
  control?: { observability?: { availability?: number; latencyP95Ms?: number }; governance?: string[] };
  agents?: Array<{ id: string; name: string; role: string }>;
  workflows?: Array<{ id: string; name: string }>;
  aiRoutes?: Array<{ id: string; provider: string; model: string; tier: string }>;
  fabric?: Array<{ id: string; protocol: string; status: string }>;
};

export default function PlatformPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/platform/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch((e) => setErr(String(e)));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 tracking-tight text-charcoal">
      <h1 className="text-[32px] font-medium">Platform</h1>
      <p className="mt-2 text-[15px] text-dim-gray">
        Enterprise layers running under Manus — same product design, extended capabilities.
      </p>
      {err ? <p className="mt-4 text-sm text-red-600">{err}</p> : null}
      {!status ? (
        <p className="mt-8 text-sm text-dim-gray">Loading platform status…</p>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card title="Kernel" body={`v${status.kernel?.version ?? "?"} · phase ${status.kernel?.phase ?? "-"}`} />
          <Card
            title="SLO"
            body={`avail ${(status.control?.observability?.availability ?? 0) * 100}% · p95 ${status.control?.observability?.latencyP95Ms ?? "-"}ms`}
          />
          <Card title="Capabilities" body={(status.kernel?.capabilities ?? []).join(", ")} />
          <Card title="Registered services" body={(status.kernel?.registered ?? []).join(", ")} />
          <Card title="Agents" body={(status.agents ?? []).map((a) => a.name).join(" · ") || "—"} />
          <Card title="Workflows" body={(status.workflows ?? []).map((w) => w.name).join(" · ") || "—"} />
          <Card
            title="AI routes"
            body={(status.aiRoutes ?? []).map((r) => `${r.provider}/${r.model}`).join(" · ") || "—"}
          />
          <Card
            title="Integration fabric"
            body={(status.fabric ?? []).map((f) => `${f.id}:${f.status}`).join(" · ") || "—"}
          />
        </div>
      )}
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-linen-border bg-warm-sand p-4">
      <p className="text-[13px] font-medium text-charcoal">{title}</p>
      <p className="mt-2 text-[12px] leading-relaxed text-dim-gray break-words">{body}</p>
    </div>
  );
}