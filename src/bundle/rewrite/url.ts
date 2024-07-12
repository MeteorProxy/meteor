export function encodeURL(url: string, origin: URL): string {
  return (
    location.origin +
    self.$meteor.config.prefix +
    self.$meteor.config.codec.encode(new URL(url, origin).href)
  )
}

export function decodeURL(string: string) {
  return self.$meteor.config.codec.decode(
    string.slice((location.origin + self.$meteor.config.prefix).length)
  )
}
