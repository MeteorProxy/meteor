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

if ('serviceworker' in globalThis.navigator) {
  // @ts-expect-error this can be ignored
  globalThis.navigator.serviceWorker = new TypeError(
    'Service Workers are not supported on proxies'
  )
}

if ('credentials' in globalThis.navigator) {
  // @ts-expect-error this can be ignored
  globalThis.navigator.credentials = patchFunction(
    // @ts-expect-error this can also be ignored
    globalThis.navigator.credentials,
    (args) => {
      self.$meteor.util.log(`Attempting to patch: ${args}`, 'teal')
      return args
    }
  )
}
