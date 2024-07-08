 import { encodeURL } from './url'

export function rewriteHeaders(headers: Headers) {
  const rewritten = new Headers()

  for (const header in headers) {
    rewritten.set(header.toLowerCase(), headers[header] as string)
  }
  ;['origin', 'referer', 'location', 'content-location'].forEach((header) => {
    rewritten.set(header, encodeURL(rewritten[header]))
  })

  return rewritten
}
