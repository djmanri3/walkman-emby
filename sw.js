const CACHE_NAME = 'walkman-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './Walkman.png',
  'https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

// Instalación del Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activación
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia de red/caché
self.addEventListener('fetch', (e) => {
  // Para streaming de Emby o API, ir siempre a la red
  if (e.request.url.includes('/Audio/') || e.request.url.includes('/Items/')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});