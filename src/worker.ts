import { BareClient, type BareResponseFetch } from '@mercuryworkshop/bare-mux'
import { version } from '../package.json'
import { getCookies, setCookies } from './bundle/util/cookies'
import errorpagecss from './errorpagecss'

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
      for (const plugin of await self.$meteor.util.getEnabledPlugins(
        url.href
      )) {
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
            if (response.headers.get('content-type')?.includes('text/html')) {
              body = await self.$meteor.rewrite.html(await response.text(), url)
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

      for (const plugin of await self.$meteor.util.getEnabledPlugins(
        url.href,
        'onRequest'
      )) {
        self.$meteor.util.log(`Running onRequest for ${plugin.name}`, 'teal')
        response = await plugin.onRequest(response)
      }

      return new Response(body, {
        headers: rewrittenHeaders,
        status: response.status,
        statusText: response.statusText
      })
    } catch (error) {
      self.$meteor.util.log(error, '#FF5757')
      const url = self.$meteor.rewrite.url.decode(request.url)
      return this.renderError(error, url, version)
    }
  }

  renderError(error: Error, url: string, version: string) {
    return new Response(
      `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Something went wrong</title>
            <!-- generated with https://play.tailwindcss.com/ -->
            <style>${errorpagecss}</style>
          </head>
          <body>
            <div class="flex min-h-[100dvh] flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
              <div class="mx-auto max-w-md text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  class="mx-auto h-12 w-12 stroke-red-400"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  ></path>
                </svg>
                <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Something went wrong
                </h1>
                <p class="mt-4 text-gray-500">
                  Meteor ran into an error while processing your request.
                </p>
                <div class="mt-6 space-y-4">
                  <p class="mt-4 text-gray-500 text-left">URL: <span class="p-1.5 px-2 bg-gray-100 font-mono text-sm rounded-md">${url}</span></p>
                  <p class="mt-4 text-gray-500 text-left">Version: <span class="p-1.5 px-2 bg-gray-100 font-mono text-sm rounded-md">${version}</span></p>
                  <pre class="rounded-md bg-gray-100 p-4 text-left text-sm text-gray-500 overflow-x-scroll">${error}</pre>
                  <div class="flex space-x-2">
                    <button onclick="window.location.reload()" class="rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900 flex-1 transition-all">
                      Reload Page
                    </button>
                    <a href="https://github.com/meteorproxy/meteor/issues/new" target="_blank" class="rounded-md border-2 border-gray-800 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-800 hover:text-white flex-1 transition-all">
                      Report Error
                    </a>
                  </div>
                </div>
              </div>
            </div>
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
