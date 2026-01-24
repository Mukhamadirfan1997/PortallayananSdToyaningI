const CACHE_NAME = "dashboard-operator-v1";
const urlsToCache = [
  "index.html",
  "offline.html",
  "manifest.json",
  "Logosekolah.png",
  "Logo Kabupaten Pasuruan.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request).then(r => r || caches.match("offline.html")))
  );
});
