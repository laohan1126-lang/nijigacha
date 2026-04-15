const CACHE = 'nijigacha-v1';
const urls = [
  '/lovelive-gacha-offline.html',
  '/manifest.json',
  '/icon-512.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(urls)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => k.filter(v => v !== CACHE)).then(a => a.forEach(v => caches.delete(v))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
      return res;
    })).catch(() => caches.match('/lovelive-gacha-offline.html'))
  );
});
