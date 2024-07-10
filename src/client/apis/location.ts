window.$location = Object.create(window.location)
// ohh boy time to add everything
Object.defineProperties(window.$location, {
  href: {
    get() {
      return self.Meteor.rewrite.url.decode(location.href)
    },
    set(value) {
      self.Meteor.rewrite.url.encode(value, self.Meteor.util.createOrigin())
    }
  },
  origin: {
    get() {
      return self.Meteor.util.createOrigin().origin
    }
  },
  search: {
    get() {
      return self.Meteor.util.createOrigin().search
    },
    set(value) {
      window.$location.search = self.Meteor.config.codec.encode(value)
    }
  },
  hash: {
    get() {
      return self.Meteor.util.createOrigin().hash
    }
  },
  pathname: {
    get() {
      return self.Meteor.util.createOrigin().pathname
    },
    set() {}
  },
  protocol: {
    get() {
      return self.Meteor.util.createOrigin().protocol
    },
    set() {}
  },
  host: {
    get() {
      return self.Meteor.util.createOrigin().host
    },
    set(value) {
      window.location.host = new URL(
        self.Meteor.rewrite.url.encode(value, self.Meteor.util.createOrigin())
      ).host
    }
  },
  replace: {
    value(url: string) {
      location.replace(
        self.Meteor.rewrite.url.encode(url, self.Meteor.util.createOrigin())
      )
    }
  }
})
