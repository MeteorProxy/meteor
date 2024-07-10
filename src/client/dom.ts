const attribs: Record<string, (new (...args: unknown[]) => HTMLElement)[]> = {
  src: [HTMLScriptElement, HTMLVideoElement, HTMLImageElement],
  href: [HTMLAnchorElement, HTMLLinkElement]
}


for (const [attr, elms] of Object.entries(attribs)) {
  for (const elm of elms) {
    const descriptors = Object.getOwnPropertyDescriptor(elm, attr)

    Object.defineProperty(elm, attr, {
      get: () => {
        descriptors.get.call(this)
      },
      set: (value) => {
        value = self.Meteor.rewrite.url.encode(
          value,
          self.Meteor.util.createOrigin()
        )
        descriptors.set.call(this, value)
      }
    })
  }
}
