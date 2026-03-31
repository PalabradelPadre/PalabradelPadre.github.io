// 🔥 Versión (cambiar cada vez que actualices)
const CACHE_NAME = 'palabra-del-padre-v12';

// 📦 Archivos esenciales para offline total
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',

  './cards.json', // 🔥 CRÍTICO (contenido espiritual)

  './Palabra192.png',
  './Palabra512.png',
  './Palabra360.png',

  './campana.mp3'
];

// 🔧 INSTALACIÓN (precache)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Cacheando archivos esenciales');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// 🔄 ACTIVACIÓN (limpieza de versiones viejas)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('🧹 Eliminando cache viejo:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// 🌐 FETCH (cache-first = verdadero offline)
self.addEventListener('fetch', event => {

  if (event.request.method !== 'GET') return;

  event.respondWith(

    caches.match(event.request).then(cachedResponse => {

      // ✅ 1. Respuesta inmediata desde cache
      if (cachedResponse) {
        return cachedResponse;
      }

      // 🌐 2. Si no está en cache → intentar red
      return fetch(event.request)
        .then(response => {

          // ⚠️ validar respuesta
          if (!response || response.status !== 200) {
            return response;
          }

          const resClone = response.clone();

          // 💾 guardar en cache dinámico
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, resClone));

          return response;
        })
        .catch(() => {

          // 🔴 3. Fallback offline
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }

        });

    })

  );
});

// 🔔 NOTIFICACIONES DESDE APP
self.addEventListener('message', event => {
  const data = event.data;

  if (data && data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon, badge, tag } = data;

    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      tag: tag || 'palabra',
      vibrate: [200, 100, 200],
      data: {
        url: './'
      }
    });
  }
});

// 🖱️ CLICK EN NOTIFICACIÓN
self.addEventListener('notificationclick', event => {

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientsArr => {

        // 🔍 Buscar si ya hay una ventana abierta
        for (const client of clientsArr) {
          if (client.url.includes('./') && 'focus' in client) {
            return client.focus();
          }
        }

        // 🚀 Si no hay, abrir nueva
        return clients.openWindow('./');
      })
  );
});
