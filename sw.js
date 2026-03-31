const CACHE_NAME = 'palabra-del-padre-v10';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './Palabra192.png',
  './Palabra512.png',
  './Palabra360.png',
  './campana.mp3'
];

// 🔧 Instalación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// 🔄 Activación
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// 🌐 Fetch - Network first
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (event.request.method === 'GET' && response && response.status === 200) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// 🔔 Mostrar notificación enviada desde el script principal
self.addEventListener('message', event => {
  const data = event.data;
  if (data && data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon, badge, tag } = data;
    self.registration.showNotification(title, { body, icon, badge, tag, vibrate: [200,100,200] });
  }
});

// 🖱️ Acción al hacer click en la notificación
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientsArr => {
      const ventana = clientsArr.find(c => c.url.includes('./'));
      if (ventana) return ventana.focus();
      return clients.openWindow('./');
    })
  );
});
