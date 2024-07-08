import { config } from '../../config'

export function encodeURL(string: string, origin?: URL): string {
  if (!origin) {
    origin = new URL(
      self.__meteor$config.codec.decode(
        location.href.slice(
          (location.origin + self.__meteor$config.prefix).length
        )
      )
    )
  }

  return config.codec.encode(string)
}

export function decodeURL(string: string) {
  return config.codec.decode(
    string.slice((location.origin + self.__meteor$config.prefix).length)
  )
}
