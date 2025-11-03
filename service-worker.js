const CACHE_NAME = 'ibnnaf-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => {
      if (k !== CACHE_NAME) return caches.delete(k);
    })))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // network-first for API calls, cache-first for static
  const reqUrl = new URL(e.request.url);
  if (reqUrl.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(response => response || fetch(e.request))
    );
  } else {
    // allow network fetch for external APIs (no caching)
    e.respondWith(fetch(e.request).catch(()=> caches.match(e.request)));
  }
});
