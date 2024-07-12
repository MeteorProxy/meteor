import { BareClient } from '@mercuryworkshop/bare-mux'
import { version } from '../package.json'

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
    return request.url.startsWith(location.origin + self.$meteor.config.prefix)
  }

  async handleFetch({ request }: FetchEvent) {
    try {
      const url = new URL(self.$meteor.rewrite.url.decode(request.url))
      self.$meteor.util.log(`Processing request for ${url.href}`)
      if (url.href.startsWith('data:')) {
        const response = await fetch(url)

        return new Response(response.body)
      }

      let response = await this.client.fetch(url, {
        method: request.method,
        body: request.body,
        headers: request.headers,
        credentials: 'omit',
        mode: request.mode === 'cors' ? request.mode : 'same-origin',
        cache: request.cache,
        redirect: request.redirect
      })

      let body: ReadableStream | string
      const rewrittenHeaders = self.$meteor.rewrite.headers(
        response.headers,
        url
      )
      // todo: get downloads working
      if (response.body) {
        switch (request.destination) {
          case 'iframe':
          case 'frame':
          case 'document':
            if (response.headers.get('content-type').includes('text/html')) {
              body = self.$meteor.rewrite.html(await response.text(), url)
            } else {
              body = response.body
            }
            break
          case 'style':
            body = self.$meteor.rewrite.css(await response.text(), url)
            break
          case 'worker':
          case 'sharedworker':
          case 'script':
            body = self.$meteor.rewrite.js(await response.text(), url)
            break
          default:
            body = response.body
        }
      }
      if (response.headers.has('content-disposition')) {
        const disposition = response.headers.get('content-disposition')
        const filename = response.finalURL.split('/').pop()
        rewrittenHeaders.set(
          'content-disposition',
          `${
            /^\s*?attachment/i.test(disposition) ? 'attachment' : 'inline'
          }; filename="${filename}"`
        )
      }
      const searchParams = new URLSearchParams(request.url)
      if (searchParams.get('hold') === 'yes') {
        await new Promise((r) =>
          setTimeout(
            r,
            Number.parseInt(searchParams.get('holdDuration')) || 99999
          )
        )
      }

      for (const plugin of self.$meteor.config.plugins) {
        if ('onRequest' in plugin) response = await plugin.onRequest(response)
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
              ${self.$meteor.config.errorPageCss}
            </style>
          </head>
          <body>
            <h1>Something went wrong</h1>
            <h3>Uh oh - something occured that prevented Meteor from processing your request.</h3>
            <textarea readonly> ${error}</textarea>
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
