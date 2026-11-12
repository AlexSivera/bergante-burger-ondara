# QA — 12/11/2026

Probado con Chromium (Playwright) sobre el build local (`dist/`) y después sobre la URL pública.

## Comprobaciones automáticas (`npm run check`)
Recursos locales existentes, anclas internas, `alt`/`width`/`height` en todas las imágenes, `source` expandidos, `target=_blank` con `noopener`, ids únicos, JSON-LD válido. Primera carga móvil ≈ 244 KB (HTML + CSS + JS + 3 fuentes + foto del hero).

## Tamaños revisados con capturas
- 360×640 (móvil pequeño): hero completo, la segunda acepción de la definición se oculta para que quepan las CTA.
- 390×844 (móvil habitual): página completa, barra fija inferior, capa a capa, carta, reserva.
- 768×1024 (tablet vertical): hero en formato móvil, escena limitada al alto de pantalla.
- 1024×768 (tablet apaisada), 844×390 (móvil apaisado), 1366×657 (portátil), 1440×900 (escritorio).

Resultado: sin desbordes horizontales; el rótulo BERGANTE pasa por detrás del pan en ambos encuadres.

## Funcional
- `tel:+34613133429` en cabecera, hero, ticket, reserva, pie y barra móvil.
- "Cómo llegar": Google Maps con la dirección (no se ha inventado ningún place_id).
- Instagram de Bergante, Umami Gastrobar, Bar La Dinaora y Buns Bunny Factory.
- Estado abierto/cerrado con hora de Madrid (probado jueves 12/11 por la mañana: "Hoy abre a las 19:00") y fila "hoy" del horario.
- Cuenta atrás de la B del mes ("Quedan 19 días" el 12/11; a partir del 1/12 muestra "Edición cerrada" hasta que se actualice `data-b-fin`).
- Capa a capa: los 8 fotogramas cambian con el scroll; precarga a 1600 px.
- Consola: 0 errores y 0 avisos; 0 imágenes rotas.
- `prefers-reduced-motion`: sin animaciones, capa a capa estática con la burger terminada y la lista completa.

## No comprobado
- Dispositivos reales iOS/Android (solo emulación de tamaño en Chromium).
- Safari/Firefox.

## Pendiente de confirmar con el cliente
- Carta de burgers: confirmada con el destacado «Carta» de Instagram (12/11/2026).
- Precios de snacks y cakes: de 2025 (las burgers subieron 1–2 € en 2026, probablemente también los snacks).
- Leyenda de alérgenos (1–12).
- Permiso para usar fotos de Instagram, de clientes en Maps y las citas de reseñas.
- Si el 613 133 429 tiene WhatsApp (no se ha anunciado como tal).
- Cada mes: actualizar nombre, ingredientes, foto y `data-b-fin` de la B del mes.
