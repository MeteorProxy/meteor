import type { BareResponseFetch } from '@mercuryworkshop/bare-mux'
import type { Codec } from './bundle/codecs'

export interface Plugin {
  name: string
  onRequest?: (
    request: BareResponseFetch
  ) => Promise<undefined | BareResponseFetch>
  handleClient?: (window: Window) => void
  inject?: (ctx: Context) => void
}

export interface Config {
  prefix: string
  codec: Codec
  plugins: Plugin[]
  errorPageCss?: string
  debug: boolean
  files: {
    client: string
    worker: string
    bundle: string
    config: string
  }
}

export interface Context {
  injectHead: (content: string) => void
  injectCSS: (content: string) => void
  injectJS: (content: string) => void
  getModified: () => string
}
