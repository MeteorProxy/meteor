const codec = self.__meteor$config.codec

export function encodeURL(string: string): string {
  return codec.encode(string)
}

export function decodeURL(string: string) {
  return codec.decode(string)
}
