import { config } from '@/config'
import { base64, none, xor } from './codecs'

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
    Meteor: typeof meteorBundle
  }
}

const meteorBundle = {
  codecs: {
    none,
    base64,
    xor
  },

  config,

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

self.Meteor = meteorBundle
