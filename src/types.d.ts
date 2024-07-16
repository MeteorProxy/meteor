import type { BareResponseFetch } from '@mercuryworkshop/bare-mux'
declare global {
  interface Window {
    __meteor$config: Config
    __meteor$codecs: { [key: string]: Codec }
  }
}
export interface Plugin {
  name: string
  filter: RegExp
  onRequest?: (
    request: BareResponseFetch
  ) => Promise<undefined | BareResponseFetch>
  handleClient?: (window: globalThis) => void
  inject?: (ctx: Context) => void
}

export interface Config {
  prefix: string
  codec: Codec
  plugins: Plugin[]
  errorPage?:
    | {
        css?: string
        head?: string
      }
    | string
  debug: boolean
  files: {
    client: string
    worker: string
    bundle: string
    codecs: string
    config: string
  }
}

export interface Codec {
  encode: (string: string) => string
  decode: (string: string) => string
}

export interface Context {
  injectHTML: (
    content: string,
    location?: 'body' | 'head',
    rewrite?: boolean
  ) => void
  getModified: () => string
}
