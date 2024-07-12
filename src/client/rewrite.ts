export function rewriteStringOrUrl(input: string | URL, origin?: URL) {
  if (!origin) {
    origin = self.$meteor.util.createOrigin()
  }

  if (input instanceof URL) {
    return new URL(
      self.$meteor.rewrite.url.encode(
        input.toString(),
        self.$meteor.util.createOrigin()
      )
    )
  }

  return self.$meteor.rewrite.url.encode(
    input,
    self.$meteor.util.createOrigin()
  )
}
