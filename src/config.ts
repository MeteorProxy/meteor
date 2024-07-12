import { xor } from './bundle/codecs'
import type { Config } from './types'

import example from './plugins/example'

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
