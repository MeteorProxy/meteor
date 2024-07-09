import { patchFunction } from './patch'

window.fetch = patchFunction(window.fetch, (args) => {
  if (args[0] instanceof Request) {
    const request = args[0]
    args[0] = new Request(
      self.Meteor.rewrite.url.encode(
        request.url,
        self.Meteor.util.createOrigin()
      ),
      request
    )
  } else if (args[0] instanceof URL) {
    args[0] = new URL(
      self.Meteor.rewrite.url.encode(
        args[0].toString(),
        self.Meteor.util.createOrigin()
      )
    )
  } else {
    args[0] = self.Meteor.rewrite.url.encode(
      args[0],
      self.Meteor.util.createOrigin()
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
          self.Meteor.util.createOrigin()
        )
      )
    } else {
      args[1] = self.Meteor.rewrite.url.encode(
        args[1],
        self.Meteor.util.createOrigin()
      )
    }

    return args
  }
)
