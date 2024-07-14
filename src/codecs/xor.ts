import type { Codec } from '.'
export const xor: Codec = {
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
}
