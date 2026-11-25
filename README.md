# Paginación 101

Guía interactiva, hecha con **HTML + CSS + JavaScript puro** (sin React ni frameworks), para explicar la paginación paso a paso a quien está empezando.

## Cómo abrirlo

Abrí `index.html` con doble clic en tu navegador. No hay que instalar nada ni levantar un servidor: todo funciona offline.

## Qué contiene

1. **¿Por qué paginar?** — Las 4 razones del curso (rendimiento, experiencia de usuario, escalabilidad y consumo de recursos) y la definición de paginador de `CLASE 14 REACT`.
2. **Las 4 cuentas** — `totalPaginas`, `inicio`, `fin` y los límites de los botones, con el detalle del error *off-by-one*.
3. **Paso 1 · Simple** — Solo «Anterior» y «Siguiente» (20 productos, 5 páginas).
4. **Paso 2 · Media** — Igual, más los números del 1 al 6 y `aria-current="page"` (24 productos, 6 páginas).
5. **Paso 3 · Avanzada** — Ventana de páginas con `…`, primera y última siempre visibles, slider de productos (12 a 480), selector de ventana e «Ir a página». El estado por defecto muestra exactamente `1 … 7 8 9 10 11 12 … 30` (120 productos ÷ 4 = 30 páginas).
6. **Resumen** — Tabla comparativa, checklist y registro de los pasos que probaste.

Cada nivel tiene:
- un paginador funcional sobre el catálogo de `Productos nacionales`,
- las tarjetas de productos que se cortan con `slice()`,
- un panel de **estado en vivo** (`paginaActual`, `inicio`, `fin`, …),
- **tres bloques de código React separados y con coloreado sintáctico**: (1) custom hook, (2) componente, (3) datos y App. Los hooks se encadenan (`usePaginacionSimple` → `usePaginacionNumerada` → `usePaginacionAvanzada`), con `useState`, `key`, `aria-current`, `useMemo` y la nota de Firebase al final del paso 3. Cada bloque tiene su propio botón «Copiar».

Ya no hay pestañas de "JS vanilla": todo el código mostrado es React, como pediste.

### Coloreado del código

Se usa **Prism.js** con el tema *Tomorrow*, guardado en `vendor/` (no se descarga de internet). Archivos incluidos: `prism-core`, `prism-clike`, `prism-markup`, `prism-javascript`, `prism-jsx` y el CSS del tema. Los bloques usan `language-jsx`, así que se colorean etiquetas, props, strings, keywords y comentarios.

## Material del curso usado

- `CLASE 14 REACT`: definición de paginador, por qué es importante, `PRODUCTOS_POR_PAGINA = 4`, `limit()` / `startAfter()` con Firebase y el botón «Cargar más».
- `CLASE 04 REACT`: productos de ejemplo *Notebook Pro*, *Monitor Curvo* y *Teclado Mecánico* (son los primeros tres del catálogo).
- `CLASE 09 REACT`: colección `Productos nacionales` y estructura de cada producto (categoría, nombre, precio, stock, imagen).

Los números de página y los puntos suspensivos son una extensión didáctica para practicar la lógica sin depender de Firebase. En el paso 3 se explica cómo se traduce a `limit()` + `startAfter()`.

## Archivos

- `index.html` — estructura y textos.
- `styles.css` — diseño responsive, light y sin dependencias externas.
- `app.js` — catálogo, estado, las 4 cuentas, generación de la ventana con `…` e interacción.

## Atajos

Con el foco en un paginador, las flechas `←` y `→` cambian de página. Los «…» son clicables y saltan de a una ventana.
