export function createOrigin() {
  return new URL(
    self.Meteor.config.codec.decode(
      location.href.slice(
        (location.origin + self.Meteor.config.prefix).length
      )
    )
  )
}
