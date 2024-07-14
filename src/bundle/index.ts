import type { Config } from '@/types'

import { rewriteCss } from './rewrite/css'
import { rewriteHeaders } from './rewrite/headers'
import { rewriteHtml } from './rewrite/html'
import { rewriteJs } from './rewrite/js'
import { decodeURL, encodeURL } from './rewrite/url'

import { createOrigin } from './util/createOrigin'
import { formatUrl } from './util/formatUrl'
import { log } from './util/logger'

declare global {
  interface Window {
    $meteor: typeof meteorBundle
    __meteor$config: Config
  }
}

const meteorBundle = {
  config: self.__meteor$config,
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
