importScripts("/meteor.bundle.js");
importScripts("/meteor.config.js");
importScripts("@mercuryworkshop/bare-as-module3")

const meteor = new MeteorServiceWorker();

self.addEventListener("fetch", (event) => {
  event.respondWith((async () => {
    if (meteor.shouldRoute(event)) {
      return await meteor.fetch(event);
    } else {
      return await fetch(event.request);
    }
  })())
}) 