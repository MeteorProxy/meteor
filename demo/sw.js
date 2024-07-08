importScripts('/meteor/meteor.bundle.js')
importScripts('/meteor/meteor.config.js')
importScripts('/meteor/meteor.worker.js')
importScripts('https://unpkg.com/@mercuryworkshop/libcurl-transport@1.3.2/dist/index.js')

const meteor = new MeteorServiceWorker()

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      if (meteor.shouldRoute(event)) {
        return await meteor.handleFetch(event)
      }

      return await fetch(event.request)
    })()
  )
})
