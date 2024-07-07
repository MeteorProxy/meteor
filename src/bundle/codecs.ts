export interface Codec {
  encode: (string: string) => string
  decode: (string: string) => string
}

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

export const base64: Codec = {
  encode(string) {
    return encodeURIComponent(btoa(string))
  },
  decode(string) {
    return decodeURIComponent(atob(string))
  }
}

export const none: Codec = {
  encode(string) {
    return encodeURIComponent(string)
  },

  decode(string) {
    return decodeURIComponent(string)
  }
}
