export function rewriteSrcset(srcset: string, origin: URL) {
  const urls = srcset.split(/ [0-9]+x,? ?/g)
  if (!urls) return ''
  const sufixes = srcset.match(/ [0-9]+x,? ?/g)
  if (!sufixes) return ''
  const rewrittenUrls = urls.map((url, i) => {
    if (url && sufixes[i]) {
      return self.Meteor.rewrite.url.encode(url, origin) + sufixes[i]
    }
  })

  return rewrittenUrls.join('')
}
