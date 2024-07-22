window.$location = Object.create(window.location)
Object.defineProperties(window.$location, {
  toString: {
    value() {
      return self.$meteor.util.createOrigin().toString()
    }
  },
  href: {
    get() {
      let url = new URL(location.href).toString()
      if (url.includes(location.origin)) {
        url = url.split(location.origin).join(location.origin)
      }
      return url
    },
    set(value) {
      self.$meteor.rewrite.url.encode(value, self.$meteor.util.createOrigin())
    }
  },
  origin: {
    get() {
      return self.$meteor.util.createOrigin().origin
    }
  },
  search: {
    get() {
      return self.$meteor.util.createOrigin().search
    },
    set(value) {
      window.location.search = self.$meteor.config.codec.encode(value)
    }
  },
  hash: {
    get() {
      return self.$meteor.util.createOrigin().hash
    }
  },
  pathname: {
    get() {
      return self.$meteor.util.createOrigin().pathname
    },
    set(value) {
      const url = self.$meteor.util.createOrigin()
      url.pathname = value
      window.location.pathname = self.$meteor.rewrite.url.encode(
        url.toString(),
        url
      )
    }
  },
  protocol: {
    get() {
      return self.$meteor.util.createOrigin().protocol
    },
    set() {}
  },
  host: {
    get() {
      return self.$meteor.util.createOrigin().host
    },
    set(value) {
      const url = self.$meteor.util.createOrigin()
      url.host = value
      window.location.host = self.$meteor.rewrite.url.encode(
        url.toString(),
        url
      )
    }
  },
  hostname: {
    get() {
      return self.$meteor.util.createOrigin().hostname
    },
    set(value) {
      const url = self.$meteor.util.createOrigin()
      url.hostname = value
      window.location.hostname = self.$meteor.rewrite.url.encode(
        url.toString(),
        url
      )
    }
  },
  port: {
    get() {
      return self.$meteor.util.createOrigin().port
    },
    set() {}
  },
  replace: {
    value(url: string) {
      location.replace(
        self.$meteor.rewrite.url.encode(url, self.$meteor.util.createOrigin())
      )
    }
  }
})
globalThis.$location = window.$location
document.$location = window.$location
