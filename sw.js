const CACHE_NAME = 'palabra-del-padre-v7'; // cambia versión cada actualización
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './icono.png'
];

// Instalación del SW
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // activa inmediatamente
  );
});

// Activación del SW
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key)) // borra caches viejos
      )
    ).then(() => self.clients.claim()) // toma control inmediato
  );
});

// Fetch - Network first
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Actualiza cache con la última versión
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => caches.match(event.request)) // fallback cache si no hay conexión
  );
});
