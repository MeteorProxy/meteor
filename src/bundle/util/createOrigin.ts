export function createOrigin() {
  return new URL(
    self.__meteor$config.codec.decode(
      location.href.slice(
        (location.origin + self.__meteor$config.prefix).length
      )
    )
  )
}
