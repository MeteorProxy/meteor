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
