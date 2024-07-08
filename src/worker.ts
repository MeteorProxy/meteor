import { config } from './config'
import { BareClient } from '@mercuryworkshop/bare-mux'

declare global {
  interface Window {
    MeteorServiceWorker: typeof MeteorServiceWorker
  }
}

class MeteorServiceWorker {
  client: BareClient
  constructor() {
    this.client = new BareClient()
  }

  shouldRoute({ request }: FetchEvent) {
    if (request.url.startsWith(location.origin + config.prefix)) return true

    return false
  }

  async handleFetch(event: FetchEvent) {
    const request = event.request
    console.log(request.url)

    let url = request.url.replace(location.origin + config.prefix, null)
    url = self.Meteor.rewrite.url.decode(url).slice(4)

    const response = await this.client.fetch(url, {
      method: request.method,
      body: request.body,
      headers: request.headers,
      credentials: 'omit',
      mode: request.mode === 'cors' ? request.mode : 'same-origin',
      cache: request.cache,
      redirect: request.redirect
    })

    let body: ReadableStream | string

    if (response.body) {
      switch (request.destination) {
        case 'document':
          body = self.Meteor.rewrite.html(await response.text())
          break
        default:
          body = response.body
      }
    }

    return new Response(body, {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText
    })
  }
}

self.MeteorServiceWorker = MeteorServiceWorker
