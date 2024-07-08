export function rewriteSrcset(srcset: string, origin: URL) {
  const urlRegex = /\S+/g

  return srcset.replace(urlRegex, (url) => {
    if (!/^\d+[wx]$/.test(url)) {
      return self.Meteor.rewrite.url.encode(url, origin)
    }
    return url
  })
}
