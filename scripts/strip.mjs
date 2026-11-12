// Utilidad de QA: une capturas en una tira horizontal. node scripts/strip.mjs <dir> <salida.jpg> <desde> <hasta> [escala]
import sharp from 'sharp'; import fs from 'node:fs';
const [dir, out, a = 0, b = 999, k = 1] = process.argv.slice(2);
const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png)$/.test(f)).sort().slice(+a, +b + 1);
const metas = await Promise.all(files.map((f) => sharp(`${dir}/${f}`).metadata()));
const w = Math.round(metas[0].width * k), h = Math.round(metas[0].height * k);
const comps = await Promise.all(files.map(async (f, i) => ({ input: await sharp(`${dir}/${f}`).resize(w, h).toBuffer(), left: i * (w + 10), top: 0 })));
await sharp({ create: { width: files.length * (w + 10), height: h, channels: 3, background: '#444' } }).composite(comps).jpeg({ quality: 78 }).toFile(out);
console.log(files.length, out);
