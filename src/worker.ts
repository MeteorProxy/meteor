import { BareClient, type BareResponseFetch } from '@mercuryworkshop/bare-mux'
import { version } from '../package.json'
import { getCookies, setCookies } from './bundle/util/cookies'

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
      for (const plugin of self.$meteor.config.plugins) {
        if (plugin.filter.test(url.href)) {
          self.$meteor.util.log(
            `Plugin ${plugin.name} loaded for this page`,
            'teal'
          )
        }
      }

      if (url.href.startsWith('data:')) {
        const response = await fetch(url)

        return new Response(response.body)
      }

      const fetchHead = new Headers(request.headers)
      fetchHead.set('cookie', (await getCookies(url.host)).join('; '))
      fetchHead.set('host', url.host)
      fetchHead.set('origin', url.origin)

      let response: BareResponseFetch = await this.client.fetch(url, {
        method: request.method,
        body: request.body,
        headers: fetchHead,
        credentials: 'omit',
        mode: request.mode === 'cors' ? request.mode : 'same-origin',
        cache: request.cache,
        redirect: request.redirect,
        // @ts-expect-error
        duplex: 'half'
      })

      let body: ReadableStream | string
      const rewrittenHeaders = self.$meteor.rewrite.headers(
        response.headers,
        url
      )
      await setCookies(response.rawHeaders['set-cookie'], url.host)

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
      // From Ultraviolet
      if (['document', 'iframe'].includes(request.destination)) {
        const header = response.headers.get('content-disposition')

        if (!/\s*?((inline|attachment);\s*?)filename=/i.test(header)) {
          const type = /^\s*?attachment/i.test(header) ? 'attachment' : 'inline'
          const [filename] = response.finalURL.split('/').reverse()
          response.headers.set(
            'Content-Disposition',
            `${type}; filename=${JSON.stringify(filename)}`
          )
        }
      }

      for (const plugin of self.$meteor.config.plugins) {
        if (plugin.filter.test(url.href)) {
          if ('onRequest' in plugin) {
            self.$meteor.util.log(
              `Running onRequest for ${plugin.name}`,
              'teal'
            )
            response = await plugin.onRequest(response)
          }
        }
      }

      return new Response(body, {
        headers: rewrittenHeaders,
        status: response.status,
        statusText: response.statusText
      })
    } catch (error) {
      self.$meteor.util.log(error, '#FF5757')
      return this.renderError(error, version)
    }
  }

  renderError(error: Error, version: string) {
    return new Response(
      typeof self.$meteor.config.errorPage === 'string'
        ? self.$meteor.config.errorPage
        : `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${self.$meteor.config.errorPage?.head || ''}
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
              ${self.$meteor.config.errorPage?.css || ''}
            </style>
          </head>
          <body>
            <h1>Something went wrong</h1>
            <h3>Uh oh - something occured that prevented Meteor from processing your request.</h3>
            <textarea readonly>${error}</textarea>
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
