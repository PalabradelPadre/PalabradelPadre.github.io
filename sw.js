const CACHE_NAME = 'palabra-del-padre-v6'; // version nueva
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './icono.png'
];

// INSTALACIÓN
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // activa SW inmediatamente
  );
});

// ACTIVACIÓN
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key)) // elimina caches viejos
      )
    ).then(() => self.clients.claim()) // toma control inmediato
  );
});

// FETCH - NETWORK FIRST
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // guarda en cache la última versión
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => caches.match(event.request)) // fallback cache si no hay internet
  );
});
