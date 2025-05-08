const CACHE_NAME = 'news-pwa-v1';
const API_CACHE = 'api-cache-v1';
const ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

// self.addEventListener('fetch', (event) => {
//   if (event.request.url.includes('/api/news')) {
//     event.respondWith(
//       fetch(event.request)
//         .then(response => {
//           const clone = response.clone();
//           caches.open(API_CACHE)
//             .then(cache => cache.put(event.request, clone));
//           return response;
//         })
//         .catch(() => caches.match(event.request))
//     );
//   } else {
//     event.respondWith(
//       caches.match(event.request)
//         .then(response => response || fetch(event.request))
//     );
//   }
// });

self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    vibrate: [200, 100, 200],
  });
});