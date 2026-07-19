// Get Board Ready — Service Worker
// Handles: PWA install, offline cache, daily study reminder

const CACHE_NAME = "gbr-v1";
const STATIC_ASSETS = ["/", "/index.html", "/manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // Network first, cache fallback for HTML
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() => caches.match("/index.html"))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Push notification handler
self.addEventListener("push", (e) => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.title || "Get Board Ready", {
      body: data.body || "Your daily IICA exam prep is waiting. Keep your streak alive! 🔥",
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      tag: "daily-reminder",
      requireInteraction: false,
      actions: [{ action: "open", title: "Study Now" }]
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: "window" }).then(clientList => {
      if (clientList.length > 0) return clientList[0].focus();
      return clients.openWindow("https://getboardready.online");
    })
  );
});

// Scheduled daily reminder using periodic background sync (where supported)
self.addEventListener("periodicsync", (e) => {
  if (e.tag === "daily-reminder") {
    e.waitUntil(
      self.registration.showNotification("📚 Daily IICA Prep Reminder", {
        body: "Don't break your streak! Your next lesson is ready. 🔥",
        icon: "/favicon.svg",
        tag: "daily-reminder"
      })
    );
  }
});
