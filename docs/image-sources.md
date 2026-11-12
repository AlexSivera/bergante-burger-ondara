# Imágenes: origen, estado y brief de sustitución

Todas se generan con `npm run images` desde `raw/` (no está en el repositorio). Recortes y etalonaje en `scripts/images.mjs`; la limpieza del rotulado de la secuencia, en `scripts/clean-build.mjs`.
Las fotos de Instagram y Google Maps se usan **solo para la demo**: antes de publicar la web definitiva hay que confirmar permiso (las de IG son del propio Bergante; las de Maps, de clientes).

| Nombre web | Sección | Fuente | Estado | Sustituir por |
|---|---|---|---|---|
| `hero-acero`, `hero-acero-m` | Hero (con el rótulo detrás del pan) | Instagram @bergante_burger, post Dbvn_imAD9t (Cheesebacon B2, 07/08/2026), foto 2 del carrusel, 3072×4096 | Real, nivel A | Misma sesión, B del mes vigente, mesa de acero, encuadre vertical con aire por arriba. **Si se cambia, hay que volver a medir la elipse del pan** (`clip-path` en `.hero__foto--delante`) |
| `cheesebacon` | Carta · Burgers | IG Dbvn_imAD9t, foto 1 | Real, A | Foto de una burger fija de la carta |
| `cheesebacon-salsa` | Archivo (agosto) | IG Dcl3PR7AF7G (28/08/2026) | Real, A | — |
| `emily` | Archivo (octubre) | IG DeCUuQVAEfA (03/10/2026), foto 1 | Real, A | — |
| `emily-servicio` | El local | IG DeCUuQVAEfA, foto 2 (brazo tatuado sirviendo) | Real, A | Sala real en servicio de noche, gente desenfocada |
| `paso-1` … `paso-8` | Capa a capa | IG DdHKSC5iOWw (10/09/2026), carrusel "Desliza para agregar…" de la Döner B; rotulado eliminado en la franja superior | Real, A | Repetir el formato cada mes con la B nueva: cámara fija, fondo gris, un fotograma por capa, **sin texto** |
| `venom` | La B del mes, Archivo | Portada del reel DfaiHCZz18U (06/11/2026), 360×640 | Real, baja resolución | Foto de producto de la Venom B a ≥2000 px |
| `txist-mak` | Archivo (julio) | Portada del reel Da3HF_6ACRm (16/07/2026), 360×640 | Real, baja resolución | — |
| `doner-guante` | Archivo (septiembre) | Portada del reel DdZWfDfwhSx (17/09/2026), 360×640 | Real, baja resolución | — |
| `halloween` | El local | Portada del reel DfE2IkKAUrG (29/10/2026), 360×640 | Real, baja resolución | Foto del equipo (con su permiso) |
| `local-mural` | El local | Google Maps, foto de cliente (ene. 2025) | Real, nivel B (móvil) | **Prioridad**: interior con el mural, de noche, luz cálida, mesas ocupadas, horizontal y vertical |
| `totopos` | Carta · Snacks | Google Maps, foto de cliente | Real, B | Foto cenital de los Totopos Umami sobre su papel |
| `pollo-thai` | Carta · Snacks | Google Maps, foto de cliente | Real, B | Pollo thai + salsa satay, luz dura como el resto |
| `cerveza` | El local | Unsplash — https://unsplash.com/es/fotos/cerveza-siendo-vertida-en-un-vaso-desde-un-grifo-oGF1LA_q84Q (licencia Unsplash, gratuita) | **Stock provisional** (ambiente, no se presenta como su barra) | Sus cervezas artesanas reales, botella + vaso, en la barra |
| `og.jpg` | Compartir en redes | Recorte apaisado de `hero-acero` | Real | — |

Logotipo: no se ha usado imagen; "BERGANTE" se compone con Big Shoulders Display 900, cercana a su wordmark condensado. En la versión final, usar su logotipo vectorial.

## Brief fotográfico (si compran la web)
1. B del mes vigente sobre el acero de cocina (vertical 4:5 y 3:5) — misma luz dura que la Cheesebacon B2.
2. Secuencia capa a capa sin rótulos cada mes (8–10 fotogramas, cámara en trípode).
3. Batatas Bergantes (el plato más nombrado en reseñas) y el resto de snacks.
4. Interior de noche con el mural y la terraza; fachada de C/ Joan Gil 15.
5. Cervezas artesanas de la nevera.
