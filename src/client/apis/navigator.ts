import { patchFunction } from '../patch'
import { rewriteStringOrUrl } from '../rewrite'

Object.defineProperties(window.navigator, {})

if ('serviceWorker' in globalThis.navigator) {
    globalThis.navigator.serviceWorker.register = patchFunction(
        globalThis.navigator.serviceWorker.register,
        (args) => {
            self.$meteor.util.log(`Attempting to register SW: /route/${self.$meteor.codecs.xor.encode(`${self.$location.origin}/${args[0]}`)}`, 'green')
            args[0] = `/route/${self.$meteor.codecs.xor.encode(`${self.$location.origin}/${args[0]}`)}`
            return args
        }
    )
}

if ('sendBeacon' in globalThis.navigator) {
    globalThis.navigator.sendBeacon = patchFunction(
        globalThis.navigator.sendBeacon,
        (args) => {
            args[0] = rewriteStringOrUrl(args[0])
            args[1] = args[1]
            return args
        }
    )
}
