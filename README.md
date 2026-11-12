# Bergante Burger · Ondara — demo web

Propuesta de web para Bergante Burger, hamburguesería en Carrer Joan Gil 15, Ondara (Umami Group).
Concepto: **Acero y sinvergüenza** — su propia fotografía de cocina (acero, luz dura), su carta impresa (crema y rojo) y su nombre (*bergante*: pícaro, sinvergüenza). Momentos clave: el nombre detrás del pan en el hero, la B del mes como comanda, la burger que se monta capa a capa con el scroll y el archivo de las B. Ver `docs/`.

## Uso

```bash
npm install          # sharp + node-html-parser
npm run images       # raw/ → src/assets/img (necesita raw/, que no está en el repo)
npm run dev          # build + servidor en http://localhost:4321
npm run check        # build + comprobaciones
npm run deploy       # build + check + publica dist/ en la rama gh-pages
```

HTML, CSS y JS sin dependencias en `src/`. El build expande `<img data-img="nombre">` a `srcset` con las tallas generadas.

## Actualizar la B del mes
En `src/index.html`, sección `#b-del-mes`: nombre, mes, líneas del ticket, `data-b-fin` (último día) y la foto (`venom` → nueva entrada en `scripts/images.mjs`). Añadir la B anterior al principio de `.archivo__lista` y el enlace de la carta (`.carta__bmes`).

## Pendiente de confirmar con el cliente
Ver `docs/qa-report.md`.
