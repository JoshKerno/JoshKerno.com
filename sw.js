const CACHE_NAME = 'joshkerno-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/portfolio.html',
  '/adventures.html',
  '/services.html',
  '/contact.html',
  '/assets/css/main.css',
  '/assets/css/noscript.css',
  '/assets/js/main.js',
  '/assets/js/jquery.min.js',
  '/assets/js/jquery.scrollex.min.js',
  '/assets/js/jquery.scrolly.min.js',
  '/assets/js/browser.min.js',
  '/assets/js/breakpoints.min.js',
  '/assets/js/util.js',
  '/assets/css/fontawesome-all.min.css',
  '/images/pic01.jpg',
  '/images/pic02.jpg',
  '/images/pic03.jpg',
  '/images/me.jpg',
  '/images/tr.jpg',
  '/images/gf.jpg'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle offline form submissions
  return fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify({
      // Form data would be stored in IndexedDB
    })
  });
} 