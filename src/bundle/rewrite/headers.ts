const tobeDeleted = [
  'cross-origin-embedder-policy',
  'cross-origin-opener-policy',
  'cross-origin-resource-policy',
  'content-security-policy',
  'content-security-policy-report-only',
  'expect-ct',
  'feature-policy',
  'origin-isolation',
  'strict-transport-security',
  'upgrade-insecure-requests',
  'x-content-type-options',
  'x-download-options',
  'x-frame-options',
  'x-permitted-cross-domain-policies',
  'x-powered-by',
  'x-xss-protection',
  'clear-site-data'
]

const directRewrites = ['host', 'origin']

export function rewriteHeaders(
  headers: Headers,
  origin: URL,
  HeadersInstance = Headers
) {
  const newHeaders = new HeadersInstance()
  // @ts-expect-error this property does exist however
  for (const [key, value] of headers.entries()) {
    newHeaders.set(key.toLowerCase(), value)
  }
  for (const header of tobeDeleted) newHeaders.delete(header)

  for (const header of ['referer', 'location', 'content-location'])
    newHeaders.set(
      header,
      self.$meteor.rewrite.url.encode(newHeaders.get(header), origin)
    )

  for (const header of directRewrites) {
    if (newHeaders.has(header)) {
      newHeaders.set(
        header,
        new URL(
          self.$meteor.rewrite.url.encode(newHeaders.get(header), origin)
        )[header]
      )
    }
  }
  if (newHeaders.has('link')) {
    newHeaders.set(
      'link',
      newHeaders
        .get('link')
        .replace(/<(.*?)>/gi, (match) =>
          self.$meteor.rewrite.url.encode(match, origin)
        )
    )
  }

  return newHeaders
}
