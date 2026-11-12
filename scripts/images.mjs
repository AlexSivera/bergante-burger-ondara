// Prepara las imágenes de la web a partir de raw/ (no se publica).
// Cada foto recibe un recorte, un etalonaje y varias anchuras webp.
// Salida: src/assets/img/<nombre>-<ancho>.webp + sizes.json  ·  Uso: npm run images
//
// Para sustituir una foto provisional: deja el archivo nuevo en raw/, cambia `src` aquí y relanza.
// La secuencia "capa a capa" sale de raw/ig/build/clean (ver scripts/clean-build.mjs).
import sharp from 'sharp';
import fs from 'node:fs/promises';

const OUT = 'src/assets/img';
const PASO = { area: [0, 470 / 1350, 1, 630 / 1350], ratio: 1080 / 630, foco: [0.5, 0.5], grade: 'estudio', sizes: [480, 800, 1080] };

// area: [x, y, ancho, alto] en fracciones — zona de la foto de la que se parte (opcional)
// ratio: recorte final (ancho/alto) · foco: punto 0–1 hacia el que se desplaza el recorte
// grade: acero (fotos de producto del propio Bergante) · movil (fotos de clientes) · estudio (sin tocar) · stock · reel (portadas de reels, baja resolución)
const FOTOS = {
  // — Fotos reales de Bergante (Instagram @bergante_burger, sesión de producto en su cocina) —
  'hero-acero':      { src: 'real/cheesebacon-acero.jpg', ratio: 16 / 9, foco: [0.5, 0.56], grade: 'acero', sizes: [960, 1440, 1920, 2560] },
  'hero-acero-m':    { src: 'real/cheesebacon-acero.jpg', ratio: 3 / 5, foco: [0.5, 0.52], grade: 'acero', sizes: [480, 768, 1080] },
  'cheesebacon':     { src: 'real/cheesebacon-cerca.jpg', ratio: 4 / 5, foco: [0.5, 0.5], grade: 'acero', sizes: [480, 800, 1200, 1600] },
  'cheesebacon-salsa': { src: 'real/cheesebacon-salsa.jpg', ratio: 4 / 5, foco: [0.5, 0.55], grade: 'acero', sizes: [480, 800, 1200] },
  'emily':           { src: 'real/emily-bandeja.jpg', ratio: 4 / 5, foco: [0.5, 0.5], grade: 'acero', sizes: [480, 800, 1200] },
  'emily-servicio':  { src: 'real/emily-servicio.jpg', ratio: 4 / 5, foco: [0.5, 0.5], grade: 'acero', sizes: [480, 800, 1200, 1600] },
  // Portadas de reels: solo existen a 360 px. Se usan pequeñas (fichas del archivo).
  'venom':           { src: 'real/venom.jpg', ratio: 9 / 16, foco: [0.5, 0.5], grade: 'reel', sizes: [360] },
  'txist-mak':       { src: 'real/txist-mak.jpg', ratio: 9 / 16, foco: [0.5, 0.5], grade: 'reel', sizes: [360] },
  'doner-guante':    { src: 'real/guante.jpg', ratio: 9 / 16, foco: [0.5, 0.5], grade: 'reel', sizes: [360] },
  'halloween':       { src: 'real/halloween.jpg', ratio: 9 / 16, foco: [0.5, 0.5], grade: 'reel', sizes: [360] },
  // Secuencia de la Döner B (carrusel de Instagram, rotulado retirado)
  'paso-1': { ...PASO, src: 'ig/build/clean/b1.png' },
  'paso-2': { ...PASO, src: 'ig/build/clean/b2.png' },
  'paso-3': { ...PASO, src: 'ig/build/clean/b3.png' },
  'paso-4': { ...PASO, src: 'ig/build/clean/b4.png' },
  'paso-5': { ...PASO, src: 'ig/build/clean/b5.png' },
  'paso-6': { ...PASO, src: 'ig/build/clean/b6.png' },
  'paso-7': { ...PASO, src: 'ig/build/clean/b7.png' },
  'paso-8': { ...PASO, src: 'ig/build/clean/b8.png' },

  // — Fotos de clientes en Google Maps (provisionales hasta la sesión de fotos) —
  'local-mural':     { src: 'real/local-mural.jpg', ratio: 4 / 5, foco: [0.5, 0.55], grade: 'movil', sizes: [480, 800, 1200] },
  'totopos':         { src: 'real/totopos.jpg', ratio: 4 / 5, foco: [0.5, 0.45], grade: 'movil', sizes: [480, 800] },
  'pollo-thai':      { src: 'real/pollo-thai.jpg', ratio: 4 / 5, foco: [0.35, 0.5], grade: 'movil', sizes: [480, 800] },

  // Neón del local (reseña de Google de edipo MTG, sept. 2026)
  'neon':            { src: 'resenas/r03.jpg', ratio: 4 / 5, foco: [0.5, 0.3], grade: 'acero', sizes: [480, 800, 1200] },
};

const VELO = { movil: [255, 186, 120, 0.12], stock: [255, 180, 110, 0.14] };

async function fuente(src, area) {
  const img = sharp(`raw/${src}`, { failOn: 'none' }).rotate();
  if (!area) return img;
  const { width: W, height: H } = await img.metadata();
  const [ax, ay, aw, ah] = area;
  const buf = await img.extract({ left: Math.round(ax * W), top: Math.round(ay * H), width: Math.round(aw * W), height: Math.round(ah * H) }).toBuffer();
  return sharp(buf);
}

async function preparar({ src, area, ratio, foco: [fx, fy], grade }) {
  const base = await fuente(src, area);
  const { width: w, height: h } = await base.metadata();
  let cw = w, ch = Math.round(w / ratio);
  if (ch > h) { ch = h; cw = Math.round(h * ratio); }
  const left = Math.round(Math.max(0, Math.min(w - cw, fx * w - cw / 2)));
  const top = Math.round(Math.max(0, Math.min(h - ch, fy * h - ch / 2)));
  let img = (await fuente(src, area)).extract({ left, top, width: cw, height: ch }).removeAlpha();

  if (grade === 'estudio') return { buf: await img.toBuffer(), cw };
  if (grade === 'acero') return { buf: await img.linear(1.04, -4).toBuffer(), cw };
  if (grade === 'reel') return { buf: await img.linear(1.05, -6).toBuffer(), cw };
  // Fotos de móvil y stock: menos saturación, negros más profundos y un velo cálido común
  img = img.modulate({ saturation: grade === 'movil' ? 0.86 : 0.9 }).linear(1.07, -10);
  const [r, g, b, a] = VELO[grade];
  const velo = await sharp({ create: { width: cw, height: ch, channels: 4, background: { r, g, b, alpha: a } } }).png().toBuffer();
  return { buf: await img.composite([{ input: velo, blend: 'soft-light' }]).toBuffer(), cw };
}

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });
const informe = [];
for (const [nombre, def] of Object.entries(FOTOS)) {
  const { buf, cw } = await preparar(def);
  const hechos = [];
  for (const w of def.sizes) {
    if (w > cw * 1.05) continue; // nunca ampliar
    const q = def.grade === 'reel' ? 82 : def.grade === 'stock' ? 70 : 74;
    await sharp(buf).resize({ width: w }).sharpen({ sigma: 0.5 }).webp({ quality: q, effort: 6 }).toFile(`${OUT}/${nombre}-${w}.webp`);
    hechos.push(w);
  }
  if (!hechos.length) {
    await sharp(buf).webp({ quality: 80, effort: 6 }).toFile(`${OUT}/${nombre}-${cw}.webp`);
    hechos.push(cw);
  }
  informe.push(`${nombre}: ${hechos.join(', ')}  (ratio ${def.ratio.toFixed(3)})`);
}

// Imagen para compartir (Open Graph): la Cheesebacon B2 sobre el acero, apaisada
const og = await preparar({ src: 'real/cheesebacon-acero.jpg', grade: 'acero', ratio: 1200 / 630, foco: [0.5, 0.56] });
await sharp(og.buf).resize(1200, 630).jpeg({ quality: 80, mozjpeg: true }).toFile('src/assets/og.jpg');

await fs.writeFile(`${OUT}/sizes.json`, JSON.stringify(Object.fromEntries(
  await Promise.all(Object.keys(FOTOS).map(async (n) => {
    const files = (await fs.readdir(OUT)).filter((f) => f.startsWith(n + '-') && /^\d+\.webp$/.test(f.slice(n.length + 1)));
    return [n, { ratio: FOTOS[n].ratio, widths: files.map((f) => +f.slice(n.length + 1, -5)).sort((a, b) => a - b) }];
  }))
), null, 2));
console.log(informe.join('\n'));
