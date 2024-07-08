
importScripts('https://unpkg.com/@mercuryworkshop/epoxy-transport@2.0.6/dist/index.js')
importScripts('/meteor/meteor.bundle.js')
importScripts('/meteor/meteor.config.js')
importScripts('/meteor/meteor.worker.js')

const meteor = new MeteorServiceWorker()

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      if (meteor.shouldRoute(event)) {
        return meteor.handleFetch(event)
      }

      return await fetch(event.request)
    })()
  )
})
