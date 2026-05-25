// Service Worker for Cat PWA Game
const CACHE_NAME = 'cat-pwa-game-v1.5';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  'css/styles.css',
  'images/icon-192.svg',
  'images/icon-512.svg',
  'js/main.js',
  'js/sound.js',
  'js/sw.js',
  'snd/burst.mp3',
  'snd/catch_feather.mp3',
  'snd/catch_laser.mp3',
  'snd/catch_mouse.mp3',
  'snd/mode.mp3',
  'snd/start.mp3',
];


// Install event: cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

// Activate event: remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

// Fetch event: serve from cache, update cache in background
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
