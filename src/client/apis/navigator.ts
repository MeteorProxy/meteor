import { patchFunction } from '../patch'
import { rewriteStringOrUrl } from '../rewrite'

Object.defineProperties(window.navigator, {})

if ('sendBeacon' in globalThis.navigator) {
  globalThis.navigator.sendBeacon = patchFunction(
    globalThis.navigator.sendBeacon,
    (args) => {
      args[0] = rewriteStringOrUrl(args[0])
      return args
    }
  )
}

if ('clipboard' in globalThis.navigator) {
  // @ts-expect-error this can be ignored
  globalThis.navigator.clipboard = patchFunction(
    // @ts-expect-error this can also be ignored
    globalThis.navigator.clipboard,
    (args) => {
      args[0]
      return args
    }
  )
}
