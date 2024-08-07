import { rewriteCss } from './rewrite/css'
import { rewriteHeaders, rewriteRawHeaders } from './rewrite/headers'
import { rewriteHtml } from './rewrite/html'
import { rewriteJs } from './rewrite/js'
import { decodeURL, encodeURL } from './rewrite/url'

import { createOrigin } from './util/createOrigin'
import { formatUrl } from './util/formatUrl'
import { log } from './util/logger'
import { getEnabledPlugins } from './util/plugins'

const meteorBundle = {
  config: self.$meteor_config,
  rewrite: {
    html: rewriteHtml,
    css: rewriteCss,
    js: rewriteJs,
    headers: rewriteHeaders,
    rawHeaders: rewriteRawHeaders,
    url: {
      encode: encodeURL,
      decode: decodeURL
    }
  },

  util: {
    createOrigin,
    formatUrl,
    log,
    getEnabledPlugins
  }
}

self.$meteor = meteorBundle
export type MeteorBundle = typeof meteorBundle
