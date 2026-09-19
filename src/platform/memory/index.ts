type MemoryItem = { id: string; scope: string; key: string; value: string; at: string };
const items: MemoryItem[] = [];

export const memory = {
  put(scope: string, key: string, value: string) {
    const existing = items.find((i) => i.scope === scope && i.key === key);
    if (existing) {
      existing.value = value;
      existing.at = new Date().toISOString();
      return existing;
    }
    const row = { id: `${scope}:${key}`, scope, key, value, at: new Date().toISOString() };
    items.push(row);
    return row;
  },
  get(scope: string, key: string) {
    return items.find((i) => i.scope === scope && i.key === key) ?? null;
  },
  list(scope?: string) {
    return scope ? items.filter((i) => i.scope === scope) : items;
  },
};