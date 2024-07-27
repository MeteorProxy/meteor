import type { MeteorBundle } from '@/bundle'
import type { BareResponseFetch } from '@mercuryworkshop/bare-mux'
type OnlyFunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never
}[keyof T]
declare global {
  interface Window {
    $meteor: MeteorBundle
    $meteor_config: Config
    $meteor_codecs: Record<string, Codec>
  }
}
export interface Plugin {
  name: string
  filter: RegExp
  onRequest?: (
    request: BareResponseFetch
  ) => Promise<undefined | BareResponseFetch>
  handleClient?: (window: globalThis) => void
  inject?: (ctx: Context) => Promise<void>
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
  ) => Promise<void>
  getModified: () => string
}

export type PluginEnables = Record<OnlyFunctionKeys<Plugin>, boolean> & {
  type?: 'meteor-plugin'
  name: string
  setAll?: boolean
}
