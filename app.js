/* =========================================================
   Paginación 101 — lógica interactiva en JavaScript puro
   Los productos de ejemplo salen de extraido/CLASE 04 REACT.txt
   y la colección "Productos nacionales" de extraido/CLASE 09 REACT.txt.
   ========================================================= */

'use strict';

/* ---------- 1. Catálogo de ejemplo ---------- */
const PRODUCTOS_BASE = [
  { nombre: 'Notebook Pro',        categoria: 'Tecnología', precio: 12000,  stock: 15,  emoji: '💻' }, // CLASE 04
  { nombre: 'Monitor Curvo',       categoria: 'Tecnología', precio: 450000, stock: 25,  emoji: '🖥️' }, // CLASE 04
  { nombre: 'Teclado Mecánico',    categoria: 'Accesorios', precio: 15000,  stock: 50,  emoji: '⌨️' }, // CLASE 04
  { nombre: 'Mouse Inalámbrico',   categoria: 'Accesorios', precio: 8500,   stock: 80,  emoji: '🖱️' },
  { nombre: 'Auriculares Bluetooth', categoria: 'Accesorios', precio: 32000, stock: 40, emoji: '🎧' },
  { nombre: 'Disco SSD 512GB',     categoria: 'Tecnología', precio: 68000,  stock: 18,  emoji: '💾' },
  { nombre: 'Webcam HD',           categoria: 'Tecnología', precio: 24000,  stock: 33,  emoji: '📷' },
  { nombre: 'Silla Gamer',         categoria: 'Oficina',    precio: 180000, stock: 12,  emoji: '🪑' },
  { nombre: 'Impresora Láser',     categoria: 'Oficina',    precio: 320000, stock: 9,   emoji: '🖨️' },
  { nombre: 'Smartphone X',        categoria: 'Tecnología', precio: 890000, stock: 22,  emoji: '📱' },
  { nombre: 'Tablet 10"',          categoria: 'Tecnología', precio: 340000, stock: 17,  emoji: '📟' },
  { nombre: 'Router Wi-Fi',        categoria: 'Tecnología', precio: 45000,  stock: 60,  emoji: '📡' },
  { nombre: 'Cable HDMI',          categoria: 'Accesorios', precio: 3500,   stock: 120, emoji: '🔌' },
  { nombre: 'Fuente 650W',         categoria: 'Tecnología', precio: 78000,  stock: 14,  emoji: '⚙️' },
  { nombre: 'Gabinete ATX',        categoria: 'Tecnología', precio: 95000,  stock: 11,  emoji: '🧩' },
  { nombre: 'Memoria RAM 16GB',    categoria: 'Tecnología', precio: 52000,  stock: 27,  emoji: '🧠' },
  { nombre: 'Tarjeta Gráfica',     categoria: 'Tecnología', precio: 780000, stock: 6,   emoji: '🎮' },
  { nombre: 'Altavoces 2.1',       categoria: 'Tecnología', precio: 42000,  stock: 30,  emoji: '🔊' },
  { nombre: 'Micrófono USB',       categoria: 'Tecnología', precio: 29000,  stock: 21,  emoji: '🎤' },
  { nombre: 'Hub USB-C',           categoria: 'Accesorios', precio: 18000,  stock: 45,  emoji: '🔌' },
  { nombre: 'Lámpara LED',         categoria: 'Oficina',    precio: 12000,  stock: 55,  emoji: '💡' },
  { nombre: 'Cuaderno A4',         categoria: 'Oficina',    precio: 2500,   stock: 200, emoji: '📓' },
  { nombre: 'Lápiz Óptico',        categoria: 'Accesorios', precio: 14000,  stock: 38,  emoji: '🖊️' },
  { nombre: 'Batería Externa',     categoria: 'Accesorios', precio: 27000,  stock: 64,  emoji: '🔋' },
  { nombre: 'Smartwatch',          categoria: 'Tecnología', precio: 210000, stock: 19,  emoji: '⌚' },
  { nombre: 'Proyector LED',       categoria: 'Oficina',    precio: 560000, stock: 7,   emoji: '📽️' },
  { nombre: 'Estabilizador',       categoria: 'Oficina',    precio: 65000,  stock: 26,  emoji: '⚡' },
  { nombre: 'Alfombrilla Gamer',   categoria: 'Accesorios', precio: 6000,   stock: 90,  emoji: '🎯' },
  { nombre: 'Cámara IP',           categoria: 'Tecnología', precio: 79000,  stock: 16,  emoji: '📸' },
  { nombre: 'Disco Externo 1TB',   categoria: 'Tecnología', precio: 110000, stock: 23,  emoji: '🗄️' }
];

const CATALOGO = [];
for (let i = 0; i < 480; i++) {
  const base = PRODUCTOS_BASE[i % PRODUCTOS_BASE.length];
  const vuelta = Math.floor(i / PRODUCTOS_BASE.length);
  CATALOGO.push({
    id: `prod-${String(i + 1).padStart(3, '0')}`,
    ...base,
    nombre: vuelta === 0 ? base.nombre : `${base.nombre} · ed. ${vuelta + 1}`
  });
}

const formatoPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0
});

/* ---------- 2. Estado de los tres niveles ---------- */
const DEFAULTS = {
  s1: { pagina: 1, total: 20,  porPagina: 4, ventana: 6 },
  s2: { pagina: 1, total: 24,  porPagina: 4, ventana: 6 },
  s3: { pagina: 9, total: 120, porPagina: 4, ventana: 6 }
};

const estado = {
  s1: { ...DEFAULTS.s1 },
  s2: { ...DEFAULTS.s2 },
  s3: { ...DEFAULTS.s3 },
  explorado: { s1: false, s2: false, s3: false }
};

/* ---------- 3. Las 4 cuentas ---------- */
function totalPaginas(s) {
  return s.total > 0 ? Math.ceil(s.total / s.porPagina) : 1;
}

function limites(s) {
  const inicio = (s.pagina - 1) * s.porPagina;
  const fin = Math.min(inicio + s.porPagina, s.total);
  return { inicio, fin };
}

function visibles(s) {
  const { inicio, fin } = limites(s);
  return CATALOGO.slice(inicio, fin);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/* ---------- 4. Ventana de páginas con "…" (nivel avanzado) ---------- */
function obtenerPaginas(actual, total, ventana) {
  if (total <= ventana + 2) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  let izq = Math.max(2, actual - Math.floor((ventana - 1) / 2));
  let der = Math.min(total - 1, izq + ventana - 1);
  izq = Math.max(2, der - ventana + 1);

  const paginas = [1];
  if (izq > 2) paginas.push('…');
  for (let p = izq; p <= der; p++) paginas.push(p);
  if (der < total - 1) paginas.push('…');
  paginas.push(total);
  return paginas;
}

/* ---------- 5. Dibujo en pantalla ---------- */
function renderProductos(clave) {
  const s = estado[clave];
  const { inicio, fin } = limites(s);
  const items = visibles(s);

  document.getElementById(`${clave}-counter`).textContent = `Página ${s.pagina} de ${totalPaginas(s)}`;
  document.getElementById(`${clave}-range`).textContent =
    s.total === 0 ? 'Sin productos' : `Productos ${inicio + 1}–${fin} de ${s.total}`;

  document.getElementById(`${clave}-products`).innerHTML = items.map((p, i) => `
    <article class="product-card">
      <div class="product-top">
        <span class="product-emoji" aria-hidden="true">${p.emoji}</span>
        <span class="product-index">#${inicio + i + 1}</span>
      </div>
      <div class="product-name">${p.nombre}</div>
      <div class="product-cat">${p.categoria}</div>
      <div class="product-meta">
        <span class="product-price">${formatoPrecio.format(p.precio)}</span>
        <span class="product-stock">stock ${p.stock}</span>
      </div>
    </article>
  `).join('');
}

function boton({ texto, disabled = false, active = false, dots = false, action, value, dir, label }) {
  const clases = ['page-btn'];
  if (dots) clases.push('dots');
  if (action === 'prev' || action === 'next') clases.push('nav');
  if (active) clases.push('active');

  const attrs = [
    'type="button"',
    `class="${clases.join(' ')}"`,
    disabled ? 'disabled' : '',
    active ? 'aria-current="page"' : '',
    action ? `data-action="${action}"` : '',
    value !== undefined ? `data-value="${value}"` : '',
    dir !== undefined ? `data-dir="${dir}"` : '',
    label ? `aria-label="${label}"` : ''
  ].filter(Boolean).join(' ');

  return `<button ${attrs}>${texto}</button>`;
}

function renderPager(clave) {
  const s = estado[clave];
  const total = totalPaginas(s);
  const partes = [];

  partes.push(boton({
    texto: '‹ Anterior', action: 'prev',
    disabled: s.pagina <= 1,
    label: 'Página anterior'
  }));

  if (clave === 's2') {
    for (let n = 1; n <= total; n++) {
      partes.push(boton({
        texto: String(n), action: 'page', value: n,
        active: n === s.pagina,
        label: `Ir a la página ${n}`
      }));
    }
  }

  if (clave === 's3') {
    let puntosVistos = 0;
    obtenerPaginas(s.pagina, total, s.ventana).forEach((p) => {
      if (p === '…') {
        // El primer "…" está a la izquierda; el segundo, a la derecha.
        const esDerecha = puntosVistos > 0;
        puntosVistos++;
        partes.push(boton({
          texto: '…', action: 'dots', dir: esDerecha ? 1 : -1, dots: true,
          label: esDerecha ? 'Saltar páginas hacia adelante' : 'Saltar páginas hacia atrás'
        }));
      } else {
        partes.push(boton({
          texto: String(p), action: 'page', value: p,
          active: p === s.pagina,
          label: `Ir a la página ${p}`
        }));
      }
    });
  }

  partes.push(boton({
    texto: 'Siguiente ›', action: 'next',
    disabled: s.pagina >= total,
    label: 'Página siguiente'
  }));

  document.getElementById(`${clave}-pager`).innerHTML = partes.join('');
}

function renderEstado(clave) {
  const s = estado[clave];
  const { inicio, fin } = limites(s);
  const total = totalPaginas(s);
  const vista = {
    paginaActual: s.pagina,
    totalPaginas: total,
    porPagina: s.porPagina,
    inicio,
    fin,
    visibles: visibles(s).length,
    _slice: `slice(${inicio}, ${fin})`
  };
  if (clave === 's3') {
    vista.ventana = s.ventana;
    vista.paginasMostradas = obtenerPaginas(s.pagina, total, s.ventana)
      .map((p) => (p === '…' ? '…' : p)).join(' ');
  }
  document.getElementById(`${clave}-state`).textContent = JSON.stringify(vista, null, 2);
}

function renderMapa() {
  const s = estado.s3;
  const total = totalPaginas(s);
  const paso = Math.max(1, Math.ceil(total / 40));
  const paginas = [];
  for (let p = 1; p <= total; p += paso) paginas.push(p);
  if (paginas[paginas.length - 1] !== total) paginas.push(total);

  document.getElementById('s3-map').innerHTML = paginas.map((p) => `
    <button type="button" class="map-tick ${p === s.pagina ? 'active' : (p < s.pagina ? 'seen' : '')}"
      data-page="${p}" aria-label="Ir a la página ${p}"
      title="Página ${p}"></button>
  `).join('');
}

function sincronizarControles() {
  const s = estado.s3;
  document.getElementById('s3-total').value = s.total;
  document.getElementById('s3-total-value').textContent = s.total;
  document.getElementById('s3-ventana').value = s.ventana;
  const go = document.getElementById('s3-go');
  go.max = totalPaginas(s);
  go.value = s.pagina;
}

function render(clave) {
  renderProductos(clave);
  renderPager(clave);
  renderEstado(clave);
  if (clave === 's3') {
    renderMapa();
    sincronizarControles();
  }
}

/* ---------- 6. Interacción ---------- */
function mover(clave, accion, value, dir) {
  const s = estado[clave];
  const total = totalPaginas(s);

  switch (accion) {
    case 'prev': s.pagina = clamp(s.pagina - 1, 1, total); break;
    case 'next': s.pagina = clamp(s.pagina + 1, 1, total); break;
    case 'page': s.pagina = clamp(Number(value), 1, total); break;
    case 'dots': s.pagina = clamp(s.pagina + dir * s.ventana, 1, total); break;
  }

  render(clave);
  marcarExplorado(clave);
}

['s1', 's2', 's3'].forEach((clave) => {
  const nav = document.getElementById(`${clave}-pager`);

  nav.addEventListener('click', (event) => {
    const btn = event.target.closest('button');
    if (!btn || btn.disabled) return;
    mover(clave, btn.dataset.action, btn.dataset.value, Number(btn.dataset.dir));
  });

  nav.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    mover(clave, event.key === 'ArrowRight' ? 'next' : 'prev');
  });
});

document.getElementById('s3-map').addEventListener('click', (event) => {
  const tick = event.target.closest('button');
  if (!tick) return;
  mover('s3', 'page', tick.dataset.page);
});

document.getElementById('s3-total').addEventListener('input', (event) => {
  estado.s3.total = Number(event.target.value);
  estado.s3.pagina = clamp(estado.s3.pagina, 1, totalPaginas(estado.s3));
  document.getElementById('s3-total-value').textContent = estado.s3.total;
  render('s3');
  marcarExplorado('s3');
});

document.getElementById('s3-ventana').addEventListener('change', (event) => {
  estado.s3.ventana = Number(event.target.value);
  render('s3');
  marcarExplorado('s3');
});

function irAPagina() {
  const input = document.getElementById('s3-go');
  const n = Number(input.value);
  if (!Number.isFinite(n)) return;
  mover('s3', 'page', n);
}
document.getElementById('s3-go-btn').addEventListener('click', irAPagina);
document.getElementById('s3-go').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') irAPagina();
});

document.querySelectorAll('[data-reset]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const clave = btn.dataset.reset;
    Object.assign(estado[clave], DEFAULTS[clave]);
    render(clave);
  });
});

/* ---------- 7. Copiar el código de React ---------- */
document.querySelectorAll('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    // Cada botón copia el bloque de su propia sección.
    const bloque = btn.closest('.code-section')?.querySelector('.code-block');
    if (!bloque) return;
    const texto = bloque.innerText;
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      const aux = document.createElement('textarea');
      aux.value = texto;
      document.body.appendChild(aux);
      aux.select();
      document.execCommand('copy');
      aux.remove();
    }
    const original = btn.textContent;
    btn.textContent = '¡Copiado!';
    setTimeout(() => { btn.textContent = original; }, 1300);
  });
});

/* ---------- 8. Progreso de los pasos ---------- */
function marcarExplorado(clave) {
  if (estado.explorado[clave]) return;
  estado.explorado[clave] = true;

  const chip = document.querySelector(`[data-step-chip="${clave}"]`);
  if (chip) chip.classList.add('done');
  const link = document.querySelector(`[data-step-link="${clave}"]`);
  if (link) link.classList.add('done');
  const step = document.querySelector(`[data-progress="${clave}"]`);
  if (step) step.classList.add('done');

  const cantidad = Object.values(estado.explorado).filter(Boolean).length;
  const textos = [
    'Todavía no tocaste ningún paginador. ¡Probá los tres!',
    '¡Buen arranque! Te falta explorar 2 niveles.',
    'Vas por el último nivel. ¡Ya casi!',
    '¡Recorrido completo! Ya dominás los 3 niveles 🎉'
  ];
  document.getElementById('progressText').textContent = textos[cantidad];
  document.getElementById('progressFill').style.width = `${(cantidad / 3) * 100}%`;
}

/* ---------- 9. Barra de scroll ---------- */
const barra = document.getElementById('scrollProgress');
let pendiente = false;
window.addEventListener('scroll', () => {
  if (pendiente) return;
  pendiente = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    barra.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    pendiente = false;
  });
}, { passive: true });

/* ---------- 10. Arranca ---------- */
render('s1');
render('s2');
render('s3');
