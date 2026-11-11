# Arquitectura

## Principios
1. **Estático puro.** No hay servidor, base de datos ni paso de compilación. Lo que ves en el repositorio es lo que se publica.
2. **Un módulo = una carpeta.** Cada módulo tiene su `index.html`, su `css/` y su `js/`. No comparten variables globales.
3. **Rutas relativas.** Nada empieza con `/`, así la app vive en cualquier subcarpeta.
4. **Dependencia externa única:** Google Fonts (`css/fonts.css`). Imágenes e iconos están en `assets/`.
5. **Todo se guarda en el dispositivo** (`localStorage`/IndexedDB). No se envía información a ningún servidor.

## Flujo
```
index.html (menú) ──▶ modules/<módulo>/index.html
sw.js (raíz) solo limpia service workers antiguos; esta edición no cachea nada fuera del navegador.
```

## Módulos

### `modules/timer/` — Temporizador y ruleta
Scripts **clásicos** que comparten el ámbito global; **el orden de carga importa** (está en `index.html`):

| Archivo | Responsabilidad |
|---|---|
| `js/backgrounds.js` | Listas `PGF` (láminas completas) y `PGT` (miniaturas) con rutas a `assets/backgrounds/` |
| `js/core.js` | Estado `S`, persistencia, cálculo de fases, render del reloj, fondo (láminas + archivo propio en IndexedDB) |
| `js/effects.js` | Canvas de polvo dorado (partículas), pulsos, sonidos |
| `js/questions.js` | Categorías `CATS` y banco de preguntas `Q` de la ruleta |
| `js/wheel.js` | Ruleta, modos de juego, puntajes, equipos |
| `js/controls.js` | Botones, atajos de teclado, ventana de proyector (`#display`), ajustes |

El **modo proyector** abre la misma página con `#display` y sincroniza el estado por `postMessage`.

### `modules/seminar/` — Seminario en vivo
- `js/presentation.js`: presentación con avatares. `build()` genera los pasos (bonos) a partir de la configuración; `renderStep()` los pinta.
- `js/tools.js`: pestañas **Calculadora de bonos**, **Catálogo** y **Liquidar producto** + liquidación imprimible.
  Datos del plan en constantes al inicio del archivo (`PK`, `LV`, `AG`, `RG`, `RD`, `BR`…). El catálogo editable parte de `DEFC()`.
- `css/seminar.css` (escenario y presentación) · `css/tools.css` (pestañas, tablas, impresión).

### `modules/simulator/` — Simulador de ganancias
- `js/simulator.js`: motor `calc(I, acc)` (un mes) y `simulate(S, months)` (proyección); datos `MEM`, `PRD`, `IMP`, `RES`, `AYU`, `ALI`, `COMBOS`, `RANKS`.

### `modules/plan-slides/` — Plan de compensación
- `index.html` contiene las diapositivas como `<div class="slide" data-title="…"><section>…</section></div>` (lienzo 1920×1080).
  Las `<aside>` son notas del presentador. `js/plan.js` escala, navega y gestiona notas/pantalla completa/impresión a PDF.

## Reglas de negocio (fuente única de verdad)
Tomadas de la presentación oficial y del sistema de control de bodega:
- 1 punto = **$1.000 COP**. Puntos de producto = precio ÷ 2.000 (Maxi Kids: 200 pts, sin descuento).
- Descuento / venta directa = **puntos × % de membresía × $1.000** por caja.
- Campaña Five: **6 %** de 1 a 4 personas, **10 %** desde 5 (semanal).
- Residual por recompras; niveles según vinculados directos activos (0-1 → 1-2 · 2 → 1-4 · 3+ → 1-7) y calificación.
- Los porcentajes por nivel están duplicados en `seminar/js/tools.js` y `simulator/js/simulator.js` (cada módulo es autónomo).
  **Si cambia el plan, actualizar ambos** (buscar `LV`, `IMP`, `RES`, `AYU`).
