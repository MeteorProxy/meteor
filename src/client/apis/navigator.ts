import { patchFunction } from "../patch"
import { rewriteStringOrUrl } from "../rewrite"

Object.defineProperties(window.navigator, {})

if ("serviceWorker" in globalThis.navigator) {
  globalThis.navigator.serviceWorker.register = patchFunction(
    globalThis.navigator.serviceWorker.register,
    (args) => {
      args[0] = rewriteStringOrUrl(args[0])
      return args
    }
  )
}
