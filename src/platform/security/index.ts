import { createHash, randomBytes } from "crypto";
import type { Result } from "../types";

const secrets = new Map<string, string>();
const audit: Array<{ at: string; actor: string; action: string; detail: string }> = [];

export const security = {
  putSecret(name: string, value: string) {
    secrets.set(name, value);
    this.audit("system", "secret.put", name);
    return true;
  },
  getSecret(name: string) {
    return secrets.get(name) ?? null;
  },
  hash(value: string) {
    return createHash("sha256").update(value).digest("hex");
  },
  token(bytes = 24) {
    return randomBytes(bytes).toString("hex");
  },
  audit(actor: string, action: string, detail: string) {
    audit.unshift({ at: new Date().toISOString(), actor, action, detail });
    if (audit.length > 500) audit.pop();
  },
  listAudit(limit = 50) {
    return audit.slice(0, limit);
  },
  encryptLocal(plain: string): Result<string> {
    // local obfuscation for demo persistence (not a substitute for KMS/HSM in prod)
    const buf = Buffer.from(plain, "utf8");
    const key = 0x5a;
    const out = Buffer.from(buf.map((b) => b ^ key));
    return { ok: true, data: out.toString("base64") };
  },
  decryptLocal(encoded: string): Result<string> {
    try {
      const buf = Buffer.from(encoded, "base64");
      const key = 0x5a;
      const out = Buffer.from(buf.map((b) => b ^ key));
      return { ok: true, data: out.toString("utf8") };
    } catch {
      return { ok: false, error: "decrypt failed", code: "CRYPTO" };
    }
  },
};