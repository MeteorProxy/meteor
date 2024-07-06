import { patchFunction } from './patch'

window.fetch = patchFunction(window.fetch, (args) => {
  if (args[0] instanceof Request) {
    const request = args[0]
    args[0] = new Request(self.Meteor.rewrite.url.encode(request.url), {
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
    })
  } else if (args[0] instanceof URL) {
    args[0] = new URL(self.Meteor.rewrite.url.encode(args[0].toString()))
  } else {
    self.Meteor.rewrite.url.encode(args[0])
  }
  
  return args
})
