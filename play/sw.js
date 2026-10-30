// Golu Gang web: offline cache. Bump VERSION on every release.
const VERSION = 'gg-web-1.2.5-off';
const FILES = ["./", "index.html", "matter.min.js", "manifest.webmanifest", "audio/theme.mp3", "fonts/baloo-2-latin-800-normal.woff2", "fonts/baloo-2-latin-600-normal.woff2", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== VERSION).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return; // ads, Firebase, leaderboard: always network
  if (r.mode === 'navigate') { e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(VERSION).then(x => x.put('index.html', c)); return res; }).catch(() => caches.match('index.html'))); return; }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(VERSION).then(x => x.put(r, c)); } return res; })));
});
