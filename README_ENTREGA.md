# Entrega Diseño Web II (SIS-0141) · C3-A2

- `deporzone/deporzone-pwa/`  → Empresa (DeporZone La Paz, PWA de reservas)
- `deporzone/lab-jquery/`     → laboratorio jQuery de DeporZone
- `fase-ui-pwa-personal/fase-ui-pwa/` → Catálogo personal (Perfil HUD PWA)

Probar en un servidor local (el Service Worker no corre con file://), por ejemplo:
`python3 -m http.server` dentro de cada carpeta de proyecto, o subir a GitHub Pages.

## Checklist del sábado 21 de noviembre
1. Prueba offline real: DevTools → Network → Offline y recargar. Ambos proyectos cargan gracias a sw.js.
2. Auditoría CLS y BEM: imágenes con width/height + aspect-ratio; clases BEM; sin !important.
3. Presentar ambos módulos completos y mantener activas las 2 balas.
