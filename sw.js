const CACHE_NAME = 'palabra-del-padre-v14';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './cards.json',
  './Palabra192.png',
  './Palabra512.png',
  './Palabra360.png',
  './libretaespiritual.html',
  './BuenPastor.html',
  './campana.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request).then(networkRes => {
        const clone = networkRes.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return networkRes;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

// 🔔 NOTIFICACIÓN
self.addEventListener('message', event => {
  if (event.data?.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: event.data.icon,
      badge: event.data.badge,
      tag: 'palabra',
      data: { url: self.location.origin }
    });
  }
});

// 🖱️ CLICK
self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientsArr => {
      for (const client of clientsArr) {
        if ('focus' in client) return client.focus();
      }
      return clients.openWindow(self.location.origin);
    })
  );
});
