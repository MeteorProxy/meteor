import { rewriteCss } from './rewrite/css'
import { rewriteHeaders } from './rewrite/headers'
import { rewriteHtml } from './rewrite/html'
import { rewriteJs } from './rewrite/js'
import { decodeURL, encodeURL } from './rewrite/url'

import type { Codec } from '@/types'
import * as codecs from './codecs'
import { createOrigin } from './util/createOrigin'
import { formatUrl } from './util/formatUrl'
import { log } from './util/logger'

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

  codecs: codecs as { [key: string]: Codec },

  util: {
    createOrigin,
    formatUrl,
    log
  }
}

self.$meteor = meteorBundle
