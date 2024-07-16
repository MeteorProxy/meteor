import type { Config } from '@/types'

import { rewriteCss } from './rewrite/css'
import { rewriteHeaders } from './rewrite/headers'
import { rewriteHtml } from './rewrite/html'
import { rewriteJs } from './rewrite/js'
import { decodeURL, encodeURL } from './rewrite/url'

import { createOrigin } from './util/createOrigin'
import { formatUrl } from './util/formatUrl'
import { log } from './util/logger'
import { base64, xor, plain } from './codecs'

declare global {
  interface Window {
    $meteor: typeof meteorBundle
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

  codecs: {
    base64,
    xor,
    plain
  },

  util: {
    createOrigin,
    formatUrl,
    log
  }
}

self.$meteor = meteorBundle