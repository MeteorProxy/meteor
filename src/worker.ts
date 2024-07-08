import { BareClient } from '@mercuryworkshop/bare-mux'
import { version } from '../package.json'
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
      const url = new URL(self.Meteor.rewrite.url.decode(request.url))
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
      const rewrittenHeaders = self.Meteor.rewrite.headers(
        response.headers,
        url
      )

      if (response.body) {
        switch (request.destination) {
          case 'document':
            body = self.Meteor.rewrite.html(await response.text(), url)
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
      return this.renderError(error, version)
    }
  }

  renderError(error: string, version: string) {
    return new Response(
      `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Error</title>
            <style>
              body {
                font-family: system-ui;
                display: flex;
                flex-direction: column;
              }

              textarea {
                font-family: monospace;
                width: 315px;
                height: 100px;
              }
            </style>
          </head>
          <body>
            <h1>Something went wrong</h1>
            <p>Uh oh - something occured that prevented Meteor from processing your request.</p>
            <textarea readonly style="font-family: monospace;"> ${error}</textarea>
            <p>Meteor ${version}</p>
          </body>
        </html>
      `,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html'
        }
      }
    )
  }
}

self.MeteorServiceWorker = MeteorServiceWorker
