import { config } from '@/config'

export function formatUrl(
  input: string,
  template = 'https://google.com/search?q=%s'
): string {
  function isValidUrl(url: string) {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const formatted = isValidUrl(input)
    ? input
    : isValidUrl(`http://${input}`) && `http://${input}`.includes('.')
      ? `http://${input}`
      : template.replace('%s', encodeURIComponent(input))

  return config.prefix + config.codec.encode(formatted)
}
