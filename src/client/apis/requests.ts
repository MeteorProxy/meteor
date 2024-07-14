import { rewriteHeaders } from '@/bundle/rewrite/headers'
import { patchConstructor, patchFunction } from '../patch'
import { rewriteStringOrUrl } from '../rewrite'
const OldHeaders = globalThis.Headers
window.fetch = patchFunction(window.fetch, (args) => {
  if (args[0] instanceof Request) {
    const request = args[0]
    args[0] = new Request(
      self.$meteor.rewrite.url.encode(
        request.url,
        self.$meteor.util.createOrigin()
      ),
      Object.defineProperty(request, 'url', { value: undefined })
    )
  } else {
    args[0] = rewriteStringOrUrl(args[0])
  }

  return args
})

window.XMLHttpRequest.prototype.open = patchFunction(
  XMLHttpRequest.prototype.open,
  (args) => {
    if (args[1] instanceof URL) {
      args[1] = new URL(
        self.$meteor.rewrite.url.encode(
          args[1].href,
          self.$meteor.util.createOrigin()
        )
      )
    } else {
      args[1] = self.$meteor.rewrite.url.encode(
        args[1],
        self.$meteor.util.createOrigin()
      )
    }

    return args
  }
)

window.Request = patchConstructor(Request, (args) => {
  if (args[0] instanceof Request) {
    const request = args[0]
    args[0] = new Request(
      self.$meteor.rewrite.url.encode(
        request.url,
        self.$meteor.util.createOrigin()
      ),
      Object.defineProperty(request, 'url', { value: undefined })
    )
  } else {
    args[0] = rewriteStringOrUrl(args[0])
  }
  return args
})
window.Headers = patchConstructor(Headers, ([arg]) => {
  arg = rewriteHeaders(
    new OldHeaders(arg),
    self.$meteor.util.createOrigin(),
    OldHeaders
  )
  return [arg]
})

Response.redirect = patchFunction(Response.redirect, (args) => {
  args[0] = rewriteStringOrUrl(args[0])
  return args
})
