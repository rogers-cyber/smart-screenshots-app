// Install event
self.addEventListener("install", event => {
  console.log("Service Worker installed");
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", event => {
  console.log("Service Worker activated");
  return self.clients.claim();
});

// Fetch event - serve files from cache if offline (simple caching)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
