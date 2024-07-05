declare global {
  interface Window {
    __meteor$config: typeof config
  }
}

export const config = {
  prefix: '/route/',
  files: {
    client: '/meteor.client.js',
    worker: '/meteor.worker.js',
    bundle: '/meteor.bundle.js',
    config: '/meteor.config.js'
  }
}

self.__meteor$config = config
