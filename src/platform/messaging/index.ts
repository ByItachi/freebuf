type EventMsg = { id: string; topic: string; payload: unknown; at: string };
const bus = new Map<string, EventMsg[]>();

export const messaging = {
  publish(topic: string, payload: unknown) {
    const msg = { id: Math.random().toString(36).slice(2), topic, payload, at: new Date().toISOString() };
    const list = bus.get(topic) ?? [];
    list.unshift(msg);
    bus.set(topic, list.slice(0, 200));
    return msg;
  },
  subscribe(topic: string, limit = 50) {
    return (bus.get(topic) ?? []).slice(0, limit);
  },
  topics() {
    return [...bus.keys()];
  },
};