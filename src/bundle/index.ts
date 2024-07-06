import { none, base64, xor } from './codecs'
import { rewriteCss } from './rewrite/css'
import { rewriteHtml } from './rewrite/html'
import { rewriteJs } from './rewrite/js'
import { decodeURL, encodeURL } from './rewrite/url'

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

  rewrite: {
    html: rewriteHtml,
    css: rewriteCss,
    js: rewriteJs,
    url: {
      encode: encodeURL,
      decode: decodeURL
    }
  }
}

self.Meteor = meteorBundle
