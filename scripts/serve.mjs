// Servidor estático mínimo para revisar dist/ en local: node scripts/serve.mjs [puerto]
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const PORT = +(process.argv[2] || process.env.PORT || 4321);
const TIPOS = { '.png': 'image/png', '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };

http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join('dist', path.normalize(p).replace(/^(\.\.[/\\])+/, ''));
  try {
    const data = await fs.readFile(f);
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(f)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404); res.end('404');
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}/`));
