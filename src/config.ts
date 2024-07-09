import { xor } from './bundle/codecs'
export type meteorConfig = typeof config
declare global {
  interface Window {
    __meteor$config: meteorConfig
  }
}

export const config = {
  prefix: '/route/',
  codec: xor,

  files: {
    client: '/meteor/meteor.client.js',
    worker: '/meteor/meteor.worker.js',
    bundle: '/meteor/meteor.bundle.js',
    config: '/meteor/meteor.config.js'
  }
}

self.__meteor$config = config
