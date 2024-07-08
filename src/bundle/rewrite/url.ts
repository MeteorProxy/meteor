import { config } from '../../config'

export function encodeURL(string: string): string {
  return config.codec.encode(string)
}

export function decodeURL(string: string) {
  return config.codec.decode(
    string.slice((location.origin + self.__meteor$config.prefix).length)
  )
}
