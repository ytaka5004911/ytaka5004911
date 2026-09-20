const CACHE_NAME = 'my-app-cache-__VERSION__';

const CACHE_PATHS = [
'/ytaka5004911/',
'/MedChartLite/'
];

self.addEventListener("install", () => {
self.skipWaiting();
});

self.addEventListener("activate", (event) => {
event.waitUntil(
caches.keys().then((keys) =>
Promise.all(
keys.map((key) => {
if (key !== CACHE_NAME) {
return caches.delete(key);
}
})
).then(() => self.clients.claim())
)
);
});

self.addEventListener("fetch", (event) => {
if (event.request.method !== "GET") return;

const url = new URL(event.request.url);

if (url.origin !== self.location.origin) return;

if (!CACHE_PATHS.some((path) =>
url.pathname === path ||
url.pathname.startsWith(path)
)) return;

event.respondWith(
caches.open(CACHE_NAME).then(async (cache) => {
const cached = await cache.match(event.request);

const network = fetch(event.request)
.then((response) => {
if (response.ok) {
cache.put(event.request, response.clone()).catch(() => {});
}
return response;
})
.catch(() => cached);

return cached || network;
})
);
});
