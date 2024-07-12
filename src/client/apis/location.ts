window.$location = Object.create(window.location)
Object.defineProperties(window.$location, {
  toString: {
    get() {
      return () => self.$meteor.util.createOrigin().toString()
    }
  },
  href: {
    get() {
      return self.$meteor.util.createOrigin().href
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
      return self.$meteor.util.createOrigin().search || ''
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
    set() {}
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
      self.$meteor.util.log('cocaine')
      const url = self.$meteor.util.createOrigin()
      url.host = value
      window.location.pathname = self.$meteor.rewrite.url.encode(
        url.toString(),
        url
      )
    }
  },
  hostname: {
    get() {
      return self.$meteor.util.createOrigin().hostname
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
