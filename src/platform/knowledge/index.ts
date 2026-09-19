import { randomUUID } from "crypto";
import { aiGateway } from "../ai";
import type { Result } from "../types";

export type KnowledgeDoc = {
  id: string;
  title: string;
  text: string;
  tags: string[];
  embedding: number[];
  createdAt: string;
};

const docs: KnowledgeDoc[] = [];

function cosine(a: number[], b: number[]) {
  let s = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) s += a[i] * b[i];
  return s;
}

export const knowledge = {
  async ingest(title: string, text: string, tags: string[] = []): Promise<Result<KnowledgeDoc>> {
    const emb = await aiGateway.embed(`${title}\n${text}`);
    if (!emb.ok) return emb;
    const doc: KnowledgeDoc = {
      id: randomUUID(),
      title,
      text,
      tags,
      embedding: emb.data,
      createdAt: new Date().toISOString(),
    };
    docs.unshift(doc);
    return { ok: true, data: doc };
  },
  async query(q: string, k = 5): Promise<Result<Array<KnowledgeDoc & { score: number }>>> {
    const emb = await aiGateway.embed(q);
    if (!emb.ok) return emb;
    const ranked = docs
      .map((d) => ({ ...d, score: cosine(emb.data, d.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
    return { ok: true, data: ranked };
  },
  list() {
    return docs;
  },
};