import { config } from '../../config'

export function encodeURL(url: string, origin: URL): string {
  return (
    location.origin +
    config.prefix +
    config.codec.encode(new URL(url, origin).href)
  )
}

export function decodeURL(string: string) {
  return config.codec.decode(
    string.slice((location.origin + self.$meteor.config.prefix).length)
  )
}
