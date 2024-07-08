import { config } from '../../config'

export function encodeURL(url: string, origin: URL): string {
  console.log(
    location.origin +
      config.prefix +
      config.codec.encode(new URL(url, origin).href)
  )
  return (
    location.origin +
    config.prefix +
    config.codec.encode(new URL(url, origin).href)
  )
}

export function decodeURL(string: string) {
  return config.codec.decode(
    string.slice((location.origin + self.__meteor$config.prefix).length)
  )
}
