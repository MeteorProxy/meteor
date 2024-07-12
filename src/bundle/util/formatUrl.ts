export function formatUrl(
  input: string,
  template = 'https://google.com/search?q=%s'
): string {
  function isValidUrl(url: string) {
    return URL.canParse(url)
  }

  const formatted = isValidUrl(input)
    ? input
    : isValidUrl(`http://${input}`) && `http://${input}`.includes('.')
      ? `http://${input}`
      : template.replace('%s', encodeURIComponent(input))

  return (
    self.$meteor.config.prefix + self.$meteor.config.codec.encode(formatted)
  )
}
