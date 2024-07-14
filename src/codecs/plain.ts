import type { Codec } from '.'

export const plain: Codec = {
  encode(string) {
    return encodeURIComponent(string)
  },

  decode(string) {
    return decodeURIComponent(string)
  }
}
