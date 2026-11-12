// Prepara la secuencia "capa a capa" (Döner B, Instagram de Bergante, sept. 2026).
// Los fotogramas 1–7 llevan rotulado "DESLIZA PARA AGREGAR…" encima de la burger.
// Aquí se sustituye esa franja por un fondo reconstruido (interpolando el gris del estudio
// entre los bordes izquierdo y derecho de cada fila) y se funde suavemente con la foto.
// Todos los fotogramas comparten encuadre: así la secuencia queda alineada.
// Entrada: raw/ig/build/b1..b8.jpg  ·  Salida: raw/ig/build/clean/b1..b8.png
import sharp from 'sharp';
import fs from 'node:fs/promises';

const DIR = 'raw/ig/build';
await fs.mkdir(`${DIR}/clean`, { recursive: true });

const Y0 = 360;   // desde aquí se limpia (por encima no se usa: el recorte empieza en 470)
const Y1 = 566;   // hasta aquí fondo reconstruido (el rótulo termina hacia y≈545)
const FUND = 22;  // filas de fundido con la foto original
const BORDE = 50; // columnas de muestra en cada borde (sin texto)

for (let n = 1; n <= 8; n++) {
  const src = `${DIR}/b${n}.jpg`;
  const out = `${DIR}/clean/b${n}.png`;
  if (n === 8) { await sharp(src).png().toFile(out); continue; } // "LISTO": la burger ocupa esa franja
  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const { width: W, channels: C } = info;
  const px = (x, y, c) => data[(y * W + x) * C + c];
  for (let y = Y0; y < Y1 + FUND; y++) {
    // color medio de los bordes en una ventana de 9 filas (menos ruido)
    const L = [0, 0, 0], R = [0, 0, 0];
    let k = 0;
    for (let yy = Math.max(0, y - 4); yy <= y + 4; yy++) {
      for (let x = 0; x < BORDE; x++) for (let c = 0; c < 3; c++) { L[c] += px(x, yy, c); R[c] += px(W - 1 - x, yy, c); }
      k += BORDE;
    }
    const a = y < Y1 ? 1 : 1 - (y - Y1) / FUND; // peso del fondo reconstruido
    for (let x = 0; x < W; x++) {
      const t = x / (W - 1);
      // ligera curvatura: el estudio es más claro en el centro (viñeta suave)
      const centro = 1 + 0.018 * Math.sin(Math.PI * t);
      for (let c = 0; c < 3; c++) {
        const fondo = ((L[c] / k) * (1 - t) + (R[c] / k) * t) * centro + (Math.random() - 0.5) * 3;
        const i = (y * W + x) * C + c;
        data[i] = Math.max(0, Math.min(255, Math.round(fondo * a + data[i] * (1 - a))));
      }
    }
  }
  await sharp(data, { raw: info }).png().toFile(out);
}
console.log('Secuencia limpia en raw/ig/build/clean/');
