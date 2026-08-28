const CACHE_NAME = 'walkman-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './Walkman.png',
  'https://unpkg.com/colorthief@3/dist/umd/color-thief.global.js',
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
  const url = e.request.url;

  // Emby / Jellyfin: streaming y API
  if (url.includes('/Audio/') || url.includes('/Items/') || url.includes('/Users/') || url.includes('/Views')) {
    return;
  }

  // Plex: streaming, library y search
  if (url.includes('/library/parts/') || url.includes('/library/sections/') || url.includes('/search?')) {
    return;
  }

  // Plex TV auth
  if (url.includes('plex.tv/api/')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});