import type { Context } from '@/types'
export function createContext(html: string): Context {
  let modified = html

  function injectAtPosition(content: string, position: number) {
    return modified.slice(0, position) + content + modified.slice(position)
  }

  return {
    injectHead: (content: string) => {
      const headCloseIndex = modified.indexOf('</head>')
      if (headCloseIndex !== -1) {
        modified = injectAtPosition(content, headCloseIndex)
      }
    },
    injectTag: (tag: string) => {
      const parser = new DOMParser().parseFromString(tag, 'text/xml')
      for (const attr of ['src', 'href']) {
        if (parser.children[0].hasAttribute(attr)) {
          parser.children[0].setAttribute(
            attr,
            self.$meteor.rewrite.url.encode(
              parser.children[0].getAttribute(attr),
              self.$meteor.util.createOrigin()
            )
          )
        }
      }
      parser.children[0].setAttribute('data-meteor-injected', 'true')
      const tagString = parser.children[0].outerHTML
      const headCloseIndex = modified.indexOf('</head>')
      if (headCloseIndex !== -1) {
        modified = injectAtPosition(tagString, headCloseIndex)
      } else {
        modified += tagString
      }
    },
    getModified: () => modified
  }
}
