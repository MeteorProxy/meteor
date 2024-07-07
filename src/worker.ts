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

    const url = self.Meteor.rewrite.url.encode(request.url)

    const response = await this.client.fetch(url, {
      method: request.method,
      body: request.body,
      headers: request.headers,
      credentials: 'omit',
      mode: request.mode === 'cors' ? request.mode : 'same-origin',
      cache: request.cache,
      redirect: request.redirect
    })

    var body: string

    if (response.body) {
      switch (request.destination) {
        case 'document':
          body = self.Meteor.rewrite.html(await response.text())
      }
    }

    return new Response(body, {
      headers: response.rawHeaders as HeadersInit,
      status: response.status,
      statusText: response.statusText
    })
  }
}

self.MeteorServiceWorker = MeteorServiceWorker
