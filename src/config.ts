import { xor } from './bundle/codecs'
export type meteorConfig = typeof config
declare global {
  interface Window {
    __meteor$config: meteorConfig
  }
}

export const config = {
  prefix: '/route/',
  files: {
    client: '/meteor.client.js',
    worker: '/meteor.worker.js',
    bundle: '/meteor.bundle.js',
    config: '/meteor.config.js'
  },
  codec: xor
}

self.__meteor$config = config
