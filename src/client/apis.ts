import { patchFunction } from './patch'

window.fetch = patchFunction(window.fetch, (args) => {
  if (args[0] instanceof Request) {
    const request = args[0]
    args[0] = new Request(
      self.Meteor.rewrite.url.encode(
        request.url,
        new URL(
          self.__meteor$config.codec.decode(
            location.href.slice(
              (location.origin + self.__meteor$config.prefix).length
            )
          )
        )
      ),
      {
        method: request.method,
        headers: request.headers,
        body: request.body,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect,
        integrity: request.integrity,
        signal: request.signal
      }
    )
  } else if (args[0] instanceof URL) {
    args[0] = new URL(
      self.Meteor.rewrite.url.encode(
        args[0].toString(),
        new URL(
          self.__meteor$config.codec.decode(
            location.href.slice(
              (location.origin + self.__meteor$config.prefix).length
            )
          )
        )
      )
    )
  } else {
    args[0] = self.Meteor.rewrite.url.encode(
      args[0],
      new URL(
        self.__meteor$config.codec.decode(
          location.href.slice(
            (location.origin + self.__meteor$config.prefix).length
          )
        )
      )
    )
  }

  console.log(args[0])

  return args
})

window.XMLHttpRequest.prototype.open = patchFunction(
  XMLHttpRequest.prototype.open,
  (args) => {
    if (args[1] instanceof URL) {
      args[1] = new URL(
        self.Meteor.rewrite.url.encode(
          args[0].toString(),
          new URL(self.Meteor.rewrite.url.decode(location.origin))
        )
      )
    } else {
      args[1] = self.Meteor.rewrite.url.encode(
        args[1],
        new URL(self.Meteor.rewrite.url.decode(location.origin))
      )
    }

    return args
  }
)
