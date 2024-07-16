import { xor } from './bundle/codecs'
import type { Config } from './types'

declare global {
  interface Window {
    __meteor$config: Config
  }
}

export const config: Config = {
  prefix: '/route/',
  codec: xor,
  debug: true,

  plugins: [
    {
      name: 'exampleplugin',
      filter: /https:\/\/example.com*/g,
      inject(ctx) {
        ctx.injectHTML(`
          <meta name="meteor" content="meteor - epic proccy">
          <script x-inject="true" src="data:application/javascript,console.log('pneis')"></script>
          `)
      },
      async onRequest(request) {
        request.headers.set('X-Proxy', 'Meteor')
        return request
      },
      handleClient(window) {
        window.console.log('Meteor is running on the client!')
        const ws = new WebSocket('wss://echo.websocket.org/')
        ws.addEventListener('message', (e) => {
          console.log(e.data)
        })
      }
    }
  ],

  files: {
    client: '/meteor/meteor.client.js',
    worker: '/meteor/meteor.worker.js',
    bundle: '/meteor/meteor.bundle.js',
    config: '/meteor/meteor.config.js'
  }
}

self.__meteor$config = config
