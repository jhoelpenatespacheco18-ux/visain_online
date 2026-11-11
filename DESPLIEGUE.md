# Despliegue (edición en línea)

Requisito: cualquier hosting de archivos estáticos. **No** necesita HTTPS obligatorio (aunque se recomienda).
Subir **el contenido** de la carpeta, sin modificarlo.

## GitHub Pages
1. Crear el repositorio (público) y subir el contenido en la **raíz** (`index.html` debe verse al abrir el repositorio).
2. *Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, carpeta `/ (root)` → Save*.
3. Esperar 1–3 minutos. URL: `https://USUARIO.github.io/REPOSITORIO/` (si el nombre del repositorio termina en guion, la URL también).
4. El archivo `.nojekyll` evita que GitHub procese las carpetas con Jekyll; no borrarlo.

Si da **404**: Pages no está activado, la URL no coincide con el nombre del repositorio, o `index.html` quedó dentro de una subcarpeta.

### Alternativa: despliegue automático con GitHub Actions (opcional)
En *Settings → Pages → Source* elegir **GitHub Actions** y crear `.github/workflows/pages.yml`:
```yaml
name: Deploy Pages
on: { push: { branches: [main] }, workflow_dispatch: {} }
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: "${{ steps.d.outputs.page_url }}" }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/upload-pages-artifact@v3
        with: { path: . }
      - id: d
        uses: actions/deploy-pages@v4
```

## Netlify / Vercel / Cloudflare Pages
Arrastrar la carpeta o conectar el repositorio. Build command: vacío. Publish directory: raíz.

## Firebase Hosting
`firebase init hosting` → public directory `.` → single-page app: **No** → `firebase deploy`.

## Apache
Copiar a `htdocs/visain/`. Servir `.webmanifest` como `application/manifest+json`.

## nginx
```nginx
location /visain/ { alias /var/www/visain-app/; index index.html; }
types { application/manifest+json webmanifest; }
```

## Actualizar una versión publicada
Reemplazar los archivos modificados y publicar. Como esta edición no guarda copia local, los usuarios ven
el cambio al recargar la página (puede tardar unos minutos por la caché de GitHub Pages).

## Añadir a la pantalla de inicio
- **Android/Chrome:** menú ⋮ → *Añadir a pantalla de inicio*.
- **iPhone/iPad (Safari):** Compartir → *Añadir a pantalla de inicio*.
