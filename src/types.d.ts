import type { BareResponseFetch } from '@mercuryworkshop/bare-mux'
import type { Codec } from './bundle/codecs'

declare global {
  interface Window {
    __meteor$config: meteorConfig
  }
}
declare global {
  interface ServiceWorkerGlobalScope {
    __meteor$config: meteorConfig
  }
}

export interface Plugin {
  name: string
  onRequest?: (
    request: BareResponseFetch
  ) => Promise<undefined | BareResponseFetch>
  handleClient?: (window: Window) => void
  inject?: (ctx: Context) => void
}

export interface meteorConfig {
  prefix: string
  codec: Codec
  plugins: Plugin[]
  errorPageCss?: string
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
