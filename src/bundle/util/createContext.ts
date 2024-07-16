import type { Context } from '@/types'
export function createContext(html: string, origin: URL): Context {
  let modified = html

  function injectAtPosition(content: string, position: number) {
    return modified.slice(0, position) + content + modified.slice(position)
  }

  return {
    injectHTML: (tag, location = 'head', rewrite = true) => {
      const tagString = rewrite ? self.$meteor.rewrite.html(tag, origin) : tag
      const headCloseIndex = modified.indexOf(`</${location}>`)
      if (headCloseIndex !== -1) {
        modified = injectAtPosition(tagString, headCloseIndex)
      } else {
        modified += tagString
      }
    },
    getModified: () => modified
  }
}
