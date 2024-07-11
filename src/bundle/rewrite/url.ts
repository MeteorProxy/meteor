export function encodeURL(url: string, origin: URL): string {
  return (
    location.origin +
    self.__meteor$config.prefix +
    self.__meteor$config.codec.encode(new URL(url, origin).href)
  )
}

export function decodeURL(string: string) {
  return self.__meteor$config.codec.decode(
    string.slice((location.origin + self.__meteor$config.prefix).length)
  )
}
