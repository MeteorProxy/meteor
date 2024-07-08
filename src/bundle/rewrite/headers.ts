import { encodeURL } from './url'

export function rewriteHeaders(headers: Headers) {
  ;['referer', 'location', 'content-location'].forEach((header) => {
    headers.set(header, encodeURL(headers[header]))
  })

  if (headers['host']) {
    headers.set('host', new URL(encodeURL(headers['host'])).host)
  }

  if (headers['origin']) {
    headers.set('origin', new URL(encodeURL(headers['origin'])).origin)
  }

  return headers
}
