// Bergante Burger — interacciones (sin dependencias)
document.documentElement.classList.add('js');

const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- Hora local de Ondara (Europe/Madrid), venga de donde venga quien mira ---------- */
function ahoraMadrid() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid', weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  const dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { dia: dias[p.weekday], min: (+p.hour % 24) * 60 + +p.minute, fecha: `${p.year}-${p.month}-${p.day}` };
}

/* ---------- Abierto / cerrado (jueves a domingo, 19:00–23:00) ---------- */
const ABRE = 19 * 60, CIERRA = 23 * 60;
const DIAS_ABIERTO = [4, 5, 6, 0];
const NOMBRE = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
function estado() {
  const { dia, min } = ahoraMadrid();
  const hoyAbre = DIAS_ABIERTO.includes(dia);
  if (hoyAbre && min >= ABRE && min < CIERRA) return { abierto: true, texto: 'Abierto · hasta las 23:00' };
  if (hoyAbre && min < ABRE) return { abierto: false, texto: 'Hoy abre a las 19:00' };
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7;
    if (DIAS_ABIERTO.includes(d)) return { abierto: false, texto: `Cerrado · abre ${i === 1 ? 'mañana' : 'el ' + NOMBRE[d]} a las 19:00` };
  }
}
function pintarEstado() {
  const e = estado();
  $$('[data-estado]').forEach((el) => { el.textContent = e.texto; el.classList.toggle('abierto', e.abierto); });
  const { dia } = ahoraMadrid();
  $$('.horario tr').forEach((tr) => tr.classList.toggle('hoy', +tr.dataset.dia === dia));
}
pintarEstado();
setInterval(pintarEstado, 60_000);

/* ---------- La B del mes: días que quedan ---------- */
const bmes = $('[data-b-fin]');
if (bmes) {
  const fin = bmes.dataset.bFin; // AAAA-MM-DD, último día de la B
  const hoy = ahoraMadrid().fecha;
  const dias = Math.round((Date.parse(fin) - Date.parse(hoy)) / 864e5);
  const el = $('[data-b-quedan]', bmes);
  const quedan = dias + 1; // contando hoy
  if (el) el.textContent = quedan > 1 ? `Quedan ${quedan} días` : quedan === 1 ? 'Último día' : 'Edición cerrada';
  // Pasado el mes, la web no se queda anunciando una B que ya no existe
  if (quedan < 1) {
    const mes = new Intl.DateTimeFormat('es', { month: 'long', timeZone: 'UTC' }).format(new Date(Date.parse(fin)));
    bmes.classList.add('bmes--cerrada');
    const etiqueta = $('[data-b-etiqueta]', bmes);
    if (etiqueta) etiqueta.textContent = `La B de ${mes} · edición cerrada`;
    const aviso = $('[data-b-aviso]', bmes);
    if (aviso) aviso.hidden = false;
    const boton = $('[data-b-boton]', bmes);
    if (boton) {
      boton.textContent = 'La próxima, en Instagram';
      boton.href = 'https://www.instagram.com/bergante_burger/';
      boton.target = '_blank';
      boton.rel = 'noopener';
      boton.classList.remove('js-reservar');
    }
    $$('[data-b-ahora]').forEach((chip) => chip.remove());
    $$('.carta__bmes .mono').forEach((m) => { m.textContent = `La última B · ${mes}`; });
  }
}

/* ---------- Reservar: en móvil llama; con ratón (ordenador) baja a la sección con el teléfono ---------- */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  $$('.js-reservar').forEach((a) => { a.href = '#reserva'; });
}

/* ---------- Menú a pantalla completa (móvil) ---------- */
const botonMenu = $('.top__menu');
const menu = $('#menu');
if (botonMenu && menu) {
  const abrir = (si) => {
    menu.hidden = !si;
    botonMenu.setAttribute('aria-expanded', String(si));
    botonMenu.textContent = si ? 'Cerrar' : 'Menú';
    document.documentElement.classList.toggle('menu-abierto', si);
    document.body.classList.toggle('menu-abierto', si);
    if (si) $('a', menu)?.focus();
  };
  botonMenu.addEventListener('click', () => abrir(menu.hidden));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => abrir(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { abrir(false); botonMenu.focus(); } });
  window.matchMedia('(min-width: 900px)').addEventListener('change', (m) => { if (m.matches) abrir(false); });
}

/* ---------- Submenú de la carta: marca la sección en pantalla ---------- */
const enlacesCarta = $$('.carta__nav a');
if (enlacesCarta.length && 'IntersectionObserver' in window) {
  const objetivos = enlacesCarta.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  const ioCarta = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      enlacesCarta.forEach((a) => a.classList.toggle('activa', a.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  objetivos.forEach((o) => ioCarta.observe(o));
}

/* ---------- Cabecera: transparente sobre el hero, sólida después; barra móvil tras el hero ---------- */
const cabecera = $('#top');
const barra = $('.barra');
const hero = $('.hero');
if ('IntersectionObserver' in window && hero) {
  new IntersectionObserver(([e]) => {
    const enHero = e.intersectionRatio > 0.35;
    cabecera.classList.toggle('top--solido', !enHero);
    barra?.classList.toggle('barra--visible', !enHero);
  }, { threshold: [0, 0.35, 0.36, 1] }).observe(hero);
}
const marcaSegunScroll = () => cabecera.classList.toggle('top--en-hero', window.scrollY < 40);
marcaSegunScroll();
window.addEventListener('scroll', marcaSegunScroll, { passive: true });

/* ---------- Apariciones suaves ---------- */
if ('IntersectionObserver' in window && !reducido) {
  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px' });
  $$('.revela').forEach((el) => io.observe(el));
} else {
  $$('.revela').forEach((el) => el.classList.add('visto'));
}

/* ---------- Capa a capa: la burger se monta con el scroll ---------- */
const capas = $('.capas');
if (capas && !reducido) {
  const fotos = $$('.capas__escena img', capas);
  const items = $$('.capas__lista li', capas);
  const num = $('[data-capa-num]', capas);
  const nombre = $('[data-capa-nombre]', capas);
  const barraCapas = $('[data-capa-barra]', capas);
  const NOMBRES = ['Brioche de obrador', 'Salsa blanca', 'Lechuga en juliana', 'Vaca madurada', 'Queso feta', 'Kebab de pollo', 'Cebolla encurtida', 'The Döner B. Lista.'];
  const total = fotos.length;
  let actual = -1;

  // Carga anticipada de todos los fotogramas al acercarse (evita parpadeos al hacer scroll rápido)
  new IntersectionObserver(([e], obs) => {
    if (!e.isIntersecting) return;
    fotos.forEach((img) => { img.loading = 'eager'; });
    obs.disconnect();
  }, { rootMargin: '1600px 0px' }).observe(capas);

  const pintar = () => {
    const r = capas.getBoundingClientRect();
    const recorrido = r.height - window.innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / recorrido));
    const i = Math.min(total - 1, Math.floor(p * total * 0.999));
    if (barraCapas) barraCapas.style.width = `${p * 100}%`;
    if (i === actual) return;
    actual = i;
    fotos.forEach((img, k) => img.classList.toggle('activa', k === i));
    items.forEach((li, k) => { li.classList.toggle('activa', k === i); li.classList.toggle('hecha', k < i); });
    if (num) num.textContent = `${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    if (nombre) nombre.textContent = NOMBRES[i];
  };
  let pendiente = false;
  window.addEventListener('scroll', () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => { pintar(); pendiente = false; });
  }, { passive: true });
  window.addEventListener('resize', pintar);
  pintar();
}
