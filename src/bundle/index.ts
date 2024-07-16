import { codecs } from '../codecs'
import { config } from '../config'
import { rewriteCss } from './rewrite/css'
import { rewriteHeaders } from './rewrite/headers'
import { rewriteHtml } from './rewrite/html'
import { rewriteJs } from './rewrite/js'
import { decodeURL, encodeURL } from './rewrite/url'

import { createOrigin } from './util/createOrigin'
import { formatUrl } from './util/formatUrl'
import { log } from './util/logger'

const meteorBundle = {
  config: self.$meteor_config,
  rewrite: {
    html: rewriteHtml,
    css: rewriteCss,
    js: rewriteJs,
    headers: rewriteHeaders,
    url: {
      encode: encodeURL,
      decode: decodeURL
    }
  },

  util: {
    createOrigin,
    formatUrl,
    log
  }
}

self.$meteor = meteorBundle
