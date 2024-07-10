export function rewriteSrcset(srcset: string, origin: URL) {
  return srcset
    .split(', ')
    .map((set) => {
      return set
        .split(' ')
        .map((url, index) => {
          return index === 0 ? self.$meteor.rewrite.url.encode(url, origin) : url
        })
        .join(' ')
    })
    .join(', ')
}
