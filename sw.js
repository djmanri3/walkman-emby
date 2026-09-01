const CACHE_NAME = 'walkman-v6';
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/Walkman.png',
  './screenshots/Player.png',
  'https://unpkg.com/colorthief@3/dist/umd/color-thief.global.js',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_ASSETS);
    })
  );
  self.skipWaiting();
});

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

self.addEventListener('fetch', (e) => {
  const url = e.request.url;

  if (e.request.method !== 'GET') return;

  if (url.includes('/Audio/') || url.includes('/Items/') || url.includes('/Users/') || url.includes('/Views')) {
    return;
  }

  if (url.includes('/library/parts/') || url.includes('/library/sections/') || url.includes('/search?')) {
    return;
  }

  if (url.includes('plex.tv/api/')) {
    return;
  }

  if (url.includes('plex.tv/devices/')) {
    return;
  }

  if (url.includes('emby.auth') || url.includes('Connect/Validate')) {
    return;
  }

  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => {
        return caches.match('./index.html');
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(e.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, networkResponse);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(e.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
        }
        return networkResponse;
      });
    })
  );
});
