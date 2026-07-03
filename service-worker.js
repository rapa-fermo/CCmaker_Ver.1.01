const CACHE_NAME = "ccmaker-v16-world";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./css/panel.css",
  "./css/card.css",
  "./js/script.js",
  "./js/responsive.js",
  "./js/template.js",
  "./js/ui.js",
  "./js/upload.js",
  "./js/drag.js",
  "./js/export.js",
  "./templates/templates.js",
  "./assets/backgrounds/bg1.jpg",
  "./assets/backgrounds/bg2.jpg",
  "./assets/backgrounds/bg3.jpg",
  "./assets/frames/frame1.png",
  "./assets/frames/frame2.png",
  "./assets/frames/frame3.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const copy = response.clone();
        if (response.ok && new URL(event.request.url).origin === location.origin) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
