import { xor } from './bundle/codecs'
import example from './plugins/example'
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

  plugins: [example],

  files: {
    client: '/meteor/meteor.client.js',
    worker: '/meteor/meteor.worker.js',
    bundle: '/meteor/meteor.bundle.js',
    config: '/meteor/meteor.config.js'
  }
}

self.__meteor$config = config
