// Service worker minimo: red primero, cache como respaldo sin conexion.
const CACHE = 'solfit-proto-v3';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' }).then((r) => {
      if (r.ok && new URL(e.request.url).origin === location.origin) {
        const copia = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copia));
      }
      return r;
    }).catch(() => caches.match(e.request))
  );
});
