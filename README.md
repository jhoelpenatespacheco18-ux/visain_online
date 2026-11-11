# VISAIN · Herramientas de seminario — edición en línea

App web (HTML + CSS + JavaScript puro) para **celular y computador** que reúne cuatro módulos:

| Módulo | Carpeta | Qué hace |
|---|---|---|
| ⏱ Temporizador y ruleta | `modules/timer/` | Cuenta regresiva, modo proyector, fondos del PDF oficial, ruleta de preguntas |
| 🎬 Seminario en vivo | `modules/seminar/` | Presentación con avatares, calculadora de bonos, catálogo editable, liquidar producto |
| 🧮 Simulador de ganancias | `modules/simulator/` | Proyección mensual de ganancias por membresía, red, recompras y ventas |
| 📊 Plan de compensación | `modules/plan-slides/` | 20 diapositivas explicadas fácil, con notas del presentador |

**Edición en línea:** necesita internet para cargar las fuentes (Google Fonts) y siempre muestra la última
versión publicada (no guarda copia en el dispositivo). Sin build, sin framework, sin dependencias.
Compatible con Chrome, Edge, Safari 14+, Firefox, Android e iOS.

## Publicar en GitHub Pages
1. Subir **el contenido** de esta carpeta a la raíz del repositorio (`index.html` debe quedar en la raíz).
2. *Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save*.
3. La app queda en `https://USUARIO.github.io/REPOSITORIO/` (ver [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md)).

## Probar en local
```bash
node scripts/serve.mjs        # http://localhost:8080  (Node 18+)
# alternativa: python3 -m http.server 8080
```

## Estructura
```
├─ index.html                 Pantalla de inicio (menú de módulos)
├─ manifest.webmanifest       Nombre, iconos y accesos directos (añadir a pantalla de inicio)
├─ sw.js                      Limpieza de service workers antiguos (no tocar)
├─ css/                       fonts.css (Google Fonts), hub.css (inicio)
├─ js/                        hub.js (inicio)
├─ assets/
│  ├─ img/                    logo y sellos de la ruleta
│  ├─ icons/                  iconos de la app
│  ├─ backgrounds/            15 láminas del PDF oficial (+ thumbs/)
│  └─ slides/                 imágenes de las diapositivas del plan
├─ modules/
│  ├─ timer/        index.html · css/timer.css · js/{backgrounds,core,effects,questions,wheel,controls}.js
│  ├─ seminar/      index.html · css/{seminar,tools}.css · js/{presentation,tools}.js
│  ├─ simulator/    index.html · css/simulator.css · js/simulator.js
│  └─ plan-slides/  index.html (contiene las 20 diapositivas) · css/plan.css · js/plan.js
├─ scripts/serve.mjs          Servidor de pruebas
└─ docs/                      ARQUITECTURA · DESPLIEGUE · DATOS-Y-ALMACENAMIENTO · EDITAR-CONTENIDO
```

## Documentación
- [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) — cómo está organizado cada módulo.
- [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md) — GitHub Pages, Netlify, Apache, nginx, Firebase, intranet.
- [`docs/DATOS-Y-ALMACENAMIENTO.md`](docs/DATOS-Y-ALMACENAMIENTO.md) — qué guarda cada módulo en el dispositivo.
- [`docs/EDITAR-CONTENIDO.md`](docs/EDITAR-CONTENIDO.md) — cambiar precios, porcentajes, preguntas y diapositivas.

## Compatibilidad
Scripts clásicos (sin `import`), rutas relativas (funciona en subcarpetas), sin CDN salvo Google Fonts,
sin analítica ni envío de datos: todo se guarda en el propio dispositivo (`localStorage`/IndexedDB).
