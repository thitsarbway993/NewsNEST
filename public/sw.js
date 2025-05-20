const CACHE_NAME = 'news-pwa-v2';
const API_CACHE = 'api-cache-v2';
const ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
  // Remove offline.html since we're using the React component
];

// Install event - cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys => Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME && key !== API_CACHE) {
            return caches.delete(key);
          }
        })
      )),
      self.clients.claim()
    ])
  );
});

// Modify the fetch event handler
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Handle API requests
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Only cache GET requests
          if (response.ok && request.method === 'GET') {
            const responseToCache = response.clone();
            caches.open(API_CACHE)
              .then(cache => {
                cache.put(request, responseToCache);
              });
          }
          return response;
        })
        .catch(async () => {
          // Only try to return cached response for GET requests
          if (request.method === 'GET') {
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
              return cachedResponse;
            }
          }
          
          return new Response(JSON.stringify({
            success: false,
            error: 'You are offline'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // Handle static assets (these are always GET requests)
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          return response;
        }

        return fetch(request).then(response => {
          if (!response.ok) {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(request, responseToCache);
            });

          return response;
        }).catch(() => {
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Offline');
        });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
      data: data.url,
      actions: [
        {
          action: 'open',
          title: 'Read more'
        }
      ]
    })
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});