/* Service worker de LIMPIEZA (edición en línea).
 * Esta edición no usa caché offline. Este archivo existe solo para que, si un dispositivo
 * instaló antes la edición «sin internet» en la misma dirección, el service worker viejo
 * se borre solo y siempre se muestre la última versión publicada. No modificar. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then((ks) => Promise.all(ks.map((k) => caches.delete(k))))
    .then(() => self.registration.unregister())
    .then(() => self.clients.matchAll()).then((cs) => cs.forEach((c) => c.navigate(c.url)))
));
