import type { Codec } from '@/types'
import { locationvariable } from './locvar'

export const codecs: Record<string, Codec> = {
  locvar: locationvariable,
  base64: {
    encode(string) {
      return encodeURIComponent(btoa(string))
    },
    decode(string) {
      return decodeURIComponent(atob(string))
    }
  },

  xor: {
    encode(str) {
      if (!str) return str
      return encodeURIComponent(
        str
          .toString()
          .split('')
          .map((char, ind) =>
            ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
          )
          .join('')
      )
    },
    decode(str) {
      if (!str) return str
      const [input, ...search] = str.split('?')

      return (
        decodeURIComponent(input)
          .split('')
          .map((char, ind) =>
            ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
          )
          .join('') + (search.length ? `?${search.join('?')}` : '')
      )
    }
  },

  plain: {
    encode(string) {
      return encodeURIComponent(string)
    },

    decode(string) {
      return decodeURIComponent(string)
    }
  }
}

self.$meteor_codecs = codecs
