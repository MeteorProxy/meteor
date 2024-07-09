export function createContext(html: string) {
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
    injectCSS: (content: string) => {
      const styleTag = `<style>${content}</style>`
      const headCloseIndex = modified.indexOf('</head>')
      if (headCloseIndex !== -1) {
        modified = injectAtPosition(styleTag, headCloseIndex)
      }
    },
    injectJS: (content: string) => {
      const scriptTag = `<script>${content}</script>`
      const bodyCloseIndex = modified.indexOf('</body>')
      if (bodyCloseIndex !== -1) {
        modified = injectAtPosition(scriptTag, bodyCloseIndex)
      } else {
        modified += scriptTag
      }
    },

    getModified: () => modified
  }
}
