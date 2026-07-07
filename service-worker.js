const CACHE_NAME = "ccmaker-v31_4_user_guide";

const APP_FILES = [
  "./",
  "./index.html",
  "./guide.html",
  "./manifest.json",
  "./css/style.css",
  "./css/panel.css",
  "./css/card.css",
  "./js/script.js",
  "./js/responsive.js",
  "./js/mobile-ui.js",
  "./js/template.js",
  "./js/ui.js",
  "./js/upload.js",
  "./js/background-drag.js",
  "./js/drag.js",
  "./js/stability.js",
  "./js/export.js",
  "./templates/templates.js",
  "./assets/backgrounds/bg1.jpg",
  "./assets/backgrounds/bg2.jpg",
  "./assets/backgrounds/bg3.jpg",
  "./assets/frames/frame1.png",
  "./assets/frames/frame2.png",
  "./assets/frames/frame3.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/guide/quick-start.svg",
  "./assets/guide/cover-card.svg",
  "./assets/guide/spread-card.svg",
  "./assets/guide/drag-edit.svg",
  "./assets/guide/activity-time.svg",
  "./assets/guide/save-json.svg"
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

  const request = event.request;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        const copy = response.clone();
        if (response.ok && new URL(request.url).origin === location.origin) {
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
