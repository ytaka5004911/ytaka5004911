const CACHE = "v1";
self.addEventListener("install", () => {
  self.skipWaiting();
});
self.addEventListener("activate", () => {
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(event.request);
      const fetchPromise = fetch(event.request)
        .then((response) => {
          cache.put(event.request, response.clone());
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});