/**
 * @type {import('./types').meteorConfig}
 */
self.__meteor$config = {
  prefix: '/route/',
  codec: $meteor.codecs.xor,
  plugins: [
    {
      name: 'exampleplugin',
      inject(ctx) {
        ctx.injectHead(`<meta name="meteor" content="meteor - epic proccy">`)
      },
      async onRequest(request) {
        request.headers.set('X-Proxy', 'Meteor')
        return request
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
