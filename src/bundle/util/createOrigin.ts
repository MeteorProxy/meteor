export function createOrigin() {
  return new URL(
    self.$meteor.config.codec.decode(
      location.href.slice((location.origin + self.$meteor.config.prefix).length)
    )
  )
}
