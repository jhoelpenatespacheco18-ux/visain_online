# Editar contenido

Después de cambiar un archivo, publicarlo; no hay paso de compilación.

## Precios, puntos y porcentajes (sin tocar código)
En la app: **Seminario → Catálogo**. Los cambios se guardan en el dispositivo. «Restaurar valores del plan» vuelve a los oficiales.

## Cambiar los valores por defecto del plan (código)
- `modules/seminar/js/tools.js`: `DEFC()` (productos y membresías), `PK` (paquetes A/B), `LV`/`AG` (% por nivel), `RG`/`RD` (rangos), `BR` (textos explicativos).
- `modules/seminar/js/presentation.js`: constantes `MEM`, `PRD`, `IMP`, `RES`, `AYU`, `ALI` de la presentación con avatares.
- `modules/simulator/js/simulator.js`: `MEM`, `PRD`, `IMP`, `RES`, `AYU`, `ALI`, `COMBOS`, `RANKS`.

## Preguntas de la ruleta
`modules/timer/js/questions.js`. Las categorías están en `CATS`; cada pregunta de `Q` es un arreglo
`[índice de categoría, tipo ('a' abierta | 'v' verdadero/falso), dificultad 1-3, pregunta, respuesta (en 'v': true/false), nota opcional]`.
Los usuarios también pueden agregar preguntas propias desde la app (se guardan en `visainMine`).

## Diapositivas del plan
`modules/plan-slides/index.html`. Cada diapositiva es:
```html
<div class="slide" id="s-nombre" data-title="Título en el selector">
  <section style="background:#170a38; … padding:128px 128px 160px; display:flex; …">
    …contenido (todo con estilos inline, lienzo de 1920×1080)…
    <aside>Notas del presentador</aside>
  </section>
</div>
```
Imágenes en `assets/slides/`. Para agregar/quitar una diapositiva basta con añadir/quitar su `<div class="slide">`; el contador y el selector se generan solos.

## Fondos del temporizador
Reemplazar `assets/backgrounds/lamina-XX.jpg` (1600×900) y su miniatura en `assets/backgrounds/thumbs/` (320×180). Mantener los nombres.

## Marca
Logo en `assets/img/logo.png`; iconos PWA en `assets/icons/`; colores en variables `:root` (`--gold`, `--p1…p3`, `--ink`).
