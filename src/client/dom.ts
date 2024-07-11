const attributes: Record<string, (new (...args: unknown[]) => HTMLElement)[]> =
  {
    src: [HTMLScriptElement, HTMLVideoElement, HTMLImageElement],
    href: [HTMLAnchorElement, HTMLLinkElement],
    action: [HTMLFormElement],
    formaction: [HTMLInputElement]
  }

for (const [attr, elms] of Object.entries(attributes)) {
  for (const elm of elms) {
    const descriptors = Object.getOwnPropertyDescriptor(elm, attr)
    Object.defineProperty(elm, attr, {
      get() {
        return descriptors.get.call(this)
      },
      set(value) {
        value = self.$meteor.rewrite.url.encode(
          value,
          self.$meteor.util.createOrigin()
        )
        descriptors.set.call(this, value)
      }
    })
  }
}
