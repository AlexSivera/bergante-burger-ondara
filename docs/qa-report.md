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
- Snacks y alérgenos: confirmados con el destacado «Carta» de Instagram (12/11/2026).
- Postres: la web dice "caseros y fuera de carta" (según reseñas); si quieren, listar los fijos con precio.
- Permiso para usar fotos de Instagram, de clientes en Maps y las citas de reseñas.
- Si el 613 133 429 tiene WhatsApp (no se ha anunciado como tal).
- Cada mes: actualizar nombre, ingredientes, foto y `data-b-fin` de la B del mes.

## Segunda pasada (12/11/2026)
Revisión completa en 390 y 1440 px con medición automática de contraste (WCAG AA) y áreas táctiles. Corregido:
1. Contraste: rojo claro `#f2463f` para texto pequeño sobre negro, rojo hondo `#8f1116` sobre el gris de estudio, alérgenos `#665c50`, verde `#226a2e`, reserva sobre `#c8191f` con texto crema. Resultado: 0 textos por debajo de AA en móvil y escritorio.
2. Foco de teclado en crema sobre fondos rojos.
3. "Reservar" con ratón (ordenador) baja a #reserva; en móvil táctil sigue siendo `tel:` (comprobado con emulación táctil).
4. B del mes caducada: pasado `data-b-fin` cambia sola a "edición cerrada", muestra aviso con enlace a Instagram, quita la etiqueta "ahora" y cambia el botón (probado forzando la fecha).
5. Tilde de "ASÍ" separada de la etiqueta.
6. Archivo en color en móvil (blanco y negro solo con ratón).
7. Portadas de reels a resolución original (Venom 1217×2160).
8. Enlaces del pie con área táctil de ~43 px.
9. Estado abierto/cerrado visible en el hero móvil.
10. Submenú fijo de la carta en móvil con sección activa.
11. Carta de escritorio: Burgers a todo el ancho con lista a dos columnas; debajo Snacks | Postres.
12. Menú a pantalla completa en móvil (Escape cierra, foco al primer enlace).
13. Foto del postre reducida.
14. "Para beber" como panel oscuro con cita real sobre las cervezas.
15. Capa a capa en móvil: burger más grande, sin hueco.
Consola sin errores ni avisos.
