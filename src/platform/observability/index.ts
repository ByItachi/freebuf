type Metric = { name: string; value: number; at: string; labels?: Record<string, string> };
type LogLine = { level: "info" | "warn" | "error"; message: string; at: string; attrs?: Record<string, string> };
type Span = { id: string; name: string; durationMs: number; at: string };

const metrics: Metric[] = [];
const logs: LogLine[] = [];
const spans: Span[] = [];

export const observability = {
  metric(name: string, value: number, labels?: Record<string, string>) {
    metrics.unshift({ name, value, labels, at: new Date().toISOString() });
    if (metrics.length > 1000) metrics.pop();
  },
  log(level: LogLine["level"], message: string, attrs?: Record<string, string>) {
    logs.unshift({ level, message, attrs, at: new Date().toISOString() });
    if (logs.length > 1000) logs.pop();
  },
  span(name: string, durationMs: number) {
    spans.unshift({ id: Math.random().toString(36).slice(2), name, durationMs, at: new Date().toISOString() });
    if (spans.length > 1000) spans.pop();
  },
  snapshot() {
    return {
      metrics: metrics.slice(0, 50),
      logs: logs.slice(0, 50),
      spans: spans.slice(0, 50),
      slo: { availability: 0.999, latencyP95Ms: 120, errorRate: 0.001 },
    };
  },
};