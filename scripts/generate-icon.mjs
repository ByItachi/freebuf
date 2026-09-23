// Generates public/freebuff-mark.png (1024×1024) for `tauri icon` — zero deps.
// Design: parchment square with a bold charcoal "F" (matches the wordmark).
import zlib from "node:zlib";
import fs from "node:fs";

const S = 1024;
const px = Buffer.alloc(S * S * 3);

const hex = (h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];
const BG = hex("#fcfbf8");
const INK = hex("#030303");

// Bold geometric "F": stem + top bar + middle bar (Lovable-style parchment/ink).
const rects = [
  [312, 264, 128, 496], // stem
  [312, 264, 424, 112], // top bar
  [312, 476, 320, 104], // middle bar
];

for (let y = 0; y < S; y++) {
  for (let x = 0; x < S; x++) {
    const inGlyph = rects.some(
      ([rx, ry, rw, rh]) => x >= rx && x < rx + rw && y >= ry && y < ry + rh,
    );
    const [r, g, b] = inGlyph ? INK : BG;
    const i = (y * S + x) * 3;
    px[i] = r;
    px[i + 1] = g;
    px[i + 2] = b;
  }
}

// --- minimal PNG encoder (truecolor RGB, filter 0) ---
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(S, 0);
ihdr.writeUInt32BE(S, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // truecolor RGB

const stride = S * 3 + 1;
const raw = Buffer.alloc(stride * S);
for (let y = 0; y < S; y++) {
  raw[y * stride] = 0; // filter: none
  px.copy(raw, y * stride + 1, y * S * 3, (y + 1) * S * 3);
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

fs.mkdirSync("public", { recursive: true });
fs.writeFileSync("public/freebuff-mark.png", png);
console.log("public/freebuff-mark.png written:", png.length, "bytes");
