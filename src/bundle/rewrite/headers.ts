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
  'x-xss-protection'
]

const directRewrites = ['host', 'origin']

export function rewriteHeaders(headers: Headers, origin: URL) {
  // // @ts-expect-error this property does exist however
  // for (const [key, value] of headers.entries())
  //   headers.set(key.toLowerCase(), value)

  for (const header of tobeDeleted) headers.delete(header)

  for (const header of ['referer', 'location', 'content-location'])
    headers.set(
      header,
      self.$meteor.rewrite.url.encode(headers.get(header), origin)
    )

  for (const header of directRewrites) {
    if (headers.has(header)) {
      headers.set(
        header,
        new URL(self.$meteor.rewrite.url.encode(headers.get(header), origin))[
          header
        ]
      )
    }
  }
  if (headers.has('link')) {
    headers.set(
      'link',
      headers
        .get('link')
        .replace(/<(.*?)>/gi, (match) =>
          self.$meteor.rewrite.url.encode(match, origin)
        )
    )
  }

  return headers
}
