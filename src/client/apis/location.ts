window.$location = Object.create(window.location)
// ohh boy time to add everything
Object.defineProperties(window.$location, {
  toString: {
    get() {
      return () => self.$meteor.util.createOrigin().toString()
    }
  },
  href: {
    get() {
      return self.$meteor.rewrite.url.decode(location.href)
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
      window.location.search = self.__meteor$config.codec.encode(value)
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
      window.location.host = new URL(
        self.$meteor.rewrite.url.encode(value, self.$meteor.util.createOrigin())
      ).host
    }
  },
  replace: {
    value(url: string) {
      location.replace(
        self.$meteor.rewrite.url.encode(url, self.$meteor.util.createOrigin())
      )
    }
  }
})
