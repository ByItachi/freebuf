import { promises as fs } from "fs";
import path from "path";

const root = path.join(process.cwd(), ".data", "platform");

export const dataPlatform = {
  async ensure() {
    await fs.mkdir(root, { recursive: true });
  },
  async putObject(key: string, value: string) {
    await this.ensure();
    const file = path.join(root, key.replace(/[^\w./-]/g, "_"));
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, value, "utf8");
    return { key, bytes: Buffer.byteLength(value) };
  },
  async getObject(key: string) {
    try {
      const file = path.join(root, key.replace(/[^\w./-]/g, "_"));
      return await fs.readFile(file, "utf8");
    } catch {
      return null;
    }
  },
};