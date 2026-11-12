# Dirección artística — "Acero y sinvergüenza"

**En una frase:** la web se siente como su cocina a las nueve de la noche —acero, luz dura, guantes negros— y habla como su nombre: *bergante*, pícaro y sinvergüenza; porque Bergante hace burgers muy cuidadas con actitud canalla, y su mejor material ya es su propia fotografía de producto.

No es una metáfora impuesta: el acero sale de sus fotos reales; el rojo y el crema, de su carta impresa; el tono, de sus propios textos ("The Fucking Salsa").

## Sistema
- **Paleta**: acero `#0e0e0f` (fondo), crema de carta `#f1eadf`, rojo Bergante `#d9262c` (texto sobre crema `#c01d23`), gris de estudio `#bfbcc2` (solo la sección capa a capa, igual al fondo de esas fotos), verde de la "V" vegana de su carta.
- **Tipografía**: Big Shoulders Display 900 (condensada, como su logotipo y su carta) para nombres y titulares; Archivo para texto; IBM Plex Mono para etiquetas tipo comanda (mes, hora, "x1").
- **Fotografía**: la suya. Luz dura, fondo oscuro, producto centrado. Fotos de clientes solo en tamaño pequeño y con etalonaje común. Sin stock: todo es material real del negocio.
- **Composición**: a sangre en producto, rejilla de reglas finas en la carta (como una carta impresa), mucho negro.
- **Botones**: rectangulares, sin radios, mayúsculas condensadas; el principal en rojo.
- **Movimiento**: mínimo y con función: el nombre detrás del pan (estático, sin trucos), la burger que se monta con el scroll, apariciones suaves. Respeta `prefers-reduced-motion`.

## Momentos distintivos
1. **Hero-portada**: BERGANTE gigante pasando *detrás* del pan de la Cheesebacon B2 (segunda capa de la foto recortada con una elipse medida sobre la propia imagen).
2. **La B del mes** como comanda de cocina: ticket térmico con los ingredientes, mes y días que quedan.
3. **Capa a capa**: la Döner B se monta con el scroll con sus 8 fotos reales.
4. **Archivo de las B**: julio → noviembre, como un calendario de drops.
5. **Carta en papel crema y rojo**, heredera de su carta física.

## Arquitectura
Hero → La B del mes → Capa a capa → Archivo de las B → Carta → El local → Reserva → Pie. Barra fija inferior en móvil (Reservar / Carta / Cómo llegar).
Acción principal: **llamar para reservar** (613 133 429). Secundarias: ver carta, cómo llegar, Instagram.
