import { BareClient } from '@mercuryworkshop/bare-mux'
import { config } from './config'

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
    return request.url.startsWith(location.origin + config.prefix)
  }

  async handleFetch(event: FetchEvent) {
    try {
      const request = event.request
      console.log('stg1', request.url, location.origin, config.prefix)
      const url = self.Meteor.rewrite.url.decode(request.url)
      console.log('stg3', url)
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
      const rewrittenHeaders = self.Meteor.rewrite.headers(response.headers)

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
        headers: rewrittenHeaders,
        status: response.status,
        statusText: response.statusText
      })
    } catch (error) {
      return new Response(`ruh roh, ${error}`, { status: 500 })
    }
  }
}

self.MeteorServiceWorker = MeteorServiceWorker
