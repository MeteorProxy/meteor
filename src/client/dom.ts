import { rewriteSrcset } from '@/bundle/rewrite/srcset'
import { patchFunction } from './patch'

// todo: add more attrs and clean up
const urlAttributes: Record<
  string,
  (new (
    ...args: unknown[]
  ) => HTMLElement)[]
> = {
  src: [
    HTMLScriptElement,
    HTMLMediaElement,
    HTMLImageElement,
    HTMLIFrameElement,
    HTMLSourceElement
  ],
  href: [HTMLAnchorElement, HTMLLinkElement],
  action: [HTMLFormElement],
  formaction: [HTMLInputElement],
  data: [HTMLObjectElement]
}

const cspAttrs = ['nonce', 'integrity', 'csp']

for (const [attr, elms] of Object.entries(urlAttributes)) {
  for (const elm of elms) {
    const descriptors = Object.getOwnPropertyDescriptor(elm.prototype, attr)
    Object.defineProperty(elm.prototype, attr, {
      get() {
        return self.$meteor.rewrite.url.decode(descriptors.get.call(this))
      },
      set(value) {
        value = self.$meteor.rewrite.url.encode(
          value,
          new URL(self.$location.origin)
        )
        descriptors.set.call(this, value)
      }
    })
  }
}

const innerHTMLDescriptor = Object.getOwnPropertyDescriptor(
  Element.prototype,
  'innerHTML'
)

Object.defineProperty(Element.prototype, 'innerHTML', {
  set(value) {
    if (this instanceof HTMLScriptElement) {
      value = self.$meteor.rewrite.js(value, new URL(self.$location.origin))
    } else if (this instanceof HTMLStyleElement) {
      value = self.$meteor.rewrite.css(value, new URL(self.$location.origin))
    }

    return innerHTMLDescriptor.set.call(this, value)
  }
})

const srcSetDescriptor = Object.getOwnPropertyDescriptor(
  HTMLImageElement.prototype,
  'srcset'
)

Object.defineProperty(HTMLImageElement.prototype, 'srcset', {
  get() {
    return srcSetDescriptor.get.call(this)
  },
  set(value) {
    value = rewriteSrcset(value, new URL(self.$location.origin))
    srcSetDescriptor.set.call(this, value)
  }
})

Element.prototype.getAttribute = patchFunction(
  Element.prototype.getAttribute,
  ([attr]) => {
    if (cspAttrs.includes(attr)) {
      return null
    }
    return [attr]
  }
)

Element.prototype.setAttribute = patchFunction(
  Element.prototype.setAttribute,
  ([attr, value]) => {
    if (cspAttrs.includes(attr)) {
      return [attr, '']
    }
    if (urlAttributes[attr]) {
      value = self.$meteor.rewrite.url.encode(
        value,
        new URL(self.$location.origin)
      )
    }
    if (attr === 'style') {
      value = self.$meteor.rewrite.css(value, new URL(self.$location.origin))
    }
    if (attr.includes('srcset')) {
      value = rewriteSrcset(value, new URL(self.$location.origin))
    }
    return [attr, value]
  }
)
