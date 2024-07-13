const urlAttributes: Record<
  string,
  (new (
    ...args: unknown[]
  ) => HTMLElement)[]
> = {
  src: [
    HTMLScriptElement,
    HTMLVideoElement,
    HTMLImageElement,
    HTMLAudioElement,
    HTMLIFrameElement
  ],
  href: [HTMLAnchorElement, HTMLLinkElement],
  action: [HTMLFormElement],
  formaction: [HTMLInputElement]
}

for (const [attr, elms] of Object.entries(urlAttributes)) {
  for (const elm of elms) {
    const descriptors = Object.getOwnPropertyDescriptor(elm.prototype, attr)
    Object.defineProperty(elm.prototype, attr, {
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
