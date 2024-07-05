import { config } from './config'

declare global {
  interface Window {
    MeteorServiceWorker: typeof MeteorServiceWorker
  }
}

class MeteorServiceWorker {
  shouldRoute(event: FetchEvent) {
    if (event.request.url.startsWith(config.prefix)) return true

    return false
  }

  handleFetch(event: FetchEvent) {}
}

self.MeteorServiceWorker = MeteorServiceWorker
