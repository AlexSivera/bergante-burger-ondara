// Comprobaciones del build: recursos locales existentes, anclas internas, alt en imágenes,
// placeholders sin sustituir, ids duplicados, JSON-LD válido y peso de la primera pantalla (móvil).
import fs from 'node:fs/promises';
import path from 'node:path';

const OUT = 'dist';
const errores = [];
const err = (m) => errores.push(m);
const existe = async (p) => fs.access(path.join(OUT, p)).then(() => true, () => false);
const css = (await fs.readFile(`${OUT}/styles.css`, 'utf8')).replace(/url\((["'])data:.*?\1\)/g, '');
const html = await fs.readFile(`${OUT}/index.html`, 'utf8');

const locales = new Set();
for (const [, v] of html.matchAll(/\s(?:src|href)="([^"#][^"]*)"/g)) {
  if (/^(https?:|mailto:|tel:|data:)/.test(v)) continue;
  locales.add(v.split('?')[0]);
}
for (const [, v] of html.matchAll(/srcset="([^"]+)"/g)) v.split(',').forEach((s) => locales.add(s.trim().split(' ')[0]));
for (const [, v] of css.matchAll(/url\((?!["']?data:)([^)]+)\)/g)) locales.add(v.replace(/['"]/g, ''));
for (const p of locales) if (p !== './' && !(await existe(p))) err(`No existe: ${p}`);

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const idSet = new Set(ids);
for (const [, a] of html.matchAll(/href="#([^"]*)"/g)) if (a && !idSet.has(a)) err(`Ancla rota: #${a}`);
for (const [, a] of html.matchAll(/aria-(?:controls|labelledby|describedby)="([^"]+)"/g)) a.split(' ').forEach((id) => { if (!idSet.has(id)) err(`aria apunta a id inexistente: ${id}`); });
const dup = ids.filter((v, i, a) => a.indexOf(v) !== i);
if (dup.length) err(`ids duplicados: ${dup.join(', ')}`);

for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
  if (!/\salt="/.test(tag)) err(`img sin alt: ${tag.slice(0, 80)}`);
  if (/data-img=/.test(tag)) err(`img sin expandir: ${tag.slice(0, 80)}`);
  if (!/\swidth="\d+"/.test(tag)) err(`img sin width/height: ${tag.slice(0, 80)}`);
}
for (const [tag] of html.matchAll(/<source\b[^>]*>/g)) if (/data-img=/.test(tag) || !/srcset=/.test(tag)) err(`source sin expandir: ${tag.slice(0, 80)}`);
for (const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) if (!/rel="[^"]*noopener/.test(tag)) err(`target _blank sin noopener: ${tag.slice(0, 80)}`);
if (html.includes('{{')) err('Placeholder {{…}} sin sustituir');
try { JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]); } catch { err('JSON-LD inválido'); }

// Peso aproximado inicial (móvil): HTML + CSS + JS + fuentes + foto del hero
let kb = 0;
for (const f of ['index.html', 'styles.css', 'main.js', 'assets/fonts/big-shoulders.woff2', 'assets/fonts/archivo.woff2', 'assets/fonts/plex-mono.woff2', 'assets/img/hero-acero-m-768.webp']) {
  kb += (await fs.stat(path.join(OUT, f))).size / 1024;
}
console.log(`${locales.size} recursos, ${idSet.size} ids · primera carga móvil ≈ ${Math.round(kb)} KB`);
if (errores.length) { console.error(errores.join('\n')); process.exit(1); }
console.log('OK');
