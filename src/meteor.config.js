/** @type {import('./types').Config} */
const config = {
  prefix: '/route/',
  codec: self.__meteor$codecs.xor,
  debug: true,

  plugins: [
    {
      name: 'exampleplugin',
      filter: /https:\/\/example.com*/g,
      inject(ctx) {
        ctx.injectHead(`<meta name="meteor" content="meteor - epic proccy">`)
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
    codecs: '/meteor/meteor.codecs.js',
    config: '/meteor/meteor.config.js'
  }
}

self.__meteor$config = config
