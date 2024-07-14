import type { Codec } from '.'

export const base64: Codec = {
  encode(string) {
    return encodeURIComponent(btoa(string))
  },
  decode(string) {
    return decodeURIComponent(atob(string))
  }
}
