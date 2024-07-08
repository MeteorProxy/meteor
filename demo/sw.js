importScripts(
  'https://unpkg.com/@mercuryworkshop/libcurl-transport@1.3.2/dist/index.js'
)
importScripts('/meteor/meteor.bundle.js')
importScripts('/meteor/meteor.config.js')
importScripts('/meteor/meteor.worker.js')

const meteor = new MeteorServiceWorker()

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      if (meteor.shouldRoute(event)) {
        console.log(event)
        const res = meteor.handleFetch(event)
        if (res) {
          return res
        }
        return new Response('oops', { status: 404 })
      }

      return await fetch(event.request)
    })()
  )
})
