/* Service Worker del Perfil HUD: proxy invisible entre navegador y red (evento fetch) */
const CACHE = 'perfil-hud-v3';
const SHELL = [
  './', './index.html', './styles.css', './app.js', './manifest.json',
  './vendor/jquery-3.6.1.min.js', './vendor/purify-3.4.14.min.js',
  './data/catalogo.json',
  './img/avatar.svg', './img/free-fire.svg', './img/mobile-legends.svg', './img/minecraft.svg',
  './img/icon-192.png', './img/icon-512.png',
  './videos/clip-1.jpg', './videos/clip-2.jpg', './videos/clip-3.jpg', './videos/clip-4.jpg', './videos/clip-5.jpg'
].concat(Array.from({ length: 15 }, (_, i) => './img/catalogo-' + String(i + 1).padStart(2, '0') + '.svg'));

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Los videos usan peticiones parciales (Range): se dejan pasar sin cachear
  if (e.request.method !== 'GET' || e.request.headers.has('range') || e.request.destination === 'video') return;
  const url = new URL(e.request.url);

  // Catálogo: primero red (datos frescos); sin internet, sirve Cache Storage
  if (url.origin === location.origin && url.pathname.endsWith('/data/catalogo.json')) {
    e.respondWith(
      fetch(e.request)
        .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return res; })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      if (res && res.status === 200 && url.origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
      }
      return res;
    }).catch(() => e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error()))
  );
});
