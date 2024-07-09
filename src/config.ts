import type { BareResponseFetch } from '@mercuryworkshop/bare-mux'
import { type Codec, xor } from './bundle/codecs'
import example from './plugins/example'
import type { meteorConfig } from './types'

declare global {
  interface Window {
    __meteor$config: meteorConfig
  }
}

export const config: meteorConfig = {
  prefix: '/route/',
  codec: xor,

  plugins: [example],

  files: {
    client: '/meteor/meteor.client.js',
    worker: '/meteor/meteor.worker.js',
    bundle: '/meteor/meteor.bundle.js',
    config: '/meteor/meteor.config.js'
  }
}

self.__meteor$config = config
