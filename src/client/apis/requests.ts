import { patchConstructor, patchFunction } from '../patch'
import { rewriteStringOrUrl } from '../rewrite'

window.fetch = patchFunction(window.fetch, (args) => {
  if (args[0] instanceof Request) {
    const request = args[0]
    args[0] = new Request(
      self.$meteor.rewrite.url.encode(
        request.url,
        self.$meteor.util.createOrigin()
      ),
      request
    )
  } else {
    args[0] = rewriteStringOrUrl(args[0])
  }

  // else if (args[0] instanceof URL) {
  //   args[0] = new URL(
  //     self.$meteor.rewrite.url.encode(
  //       args[0].toString(),
  //       self.$meteor.util.createOrigin()
  //     )
  //   )
  // } else {
  //   args[0] = self.$meteor.rewrite.url.encode(
  //     args[0],
  //     self.$meteor.util.createOrigin()
  //   )
  // }

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
  if (args[0] instanceof URL) {
    args[0] = new URL(
      self.$meteor.rewrite.url.encode(
        args[0].toString(),
        self.$meteor.util.createOrigin()
      )
    )
  } else if (typeof args[0] === 'string') {
    args[0] = self.$meteor.rewrite.url.encode(
      args[0],
      self.$meteor.util.createOrigin()
    )
  }
  return args
})
