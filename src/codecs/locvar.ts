// made by `interpolation-0`
import type { Codec } from '@/types'

const factory = (key: string) => {
  const getShuffledAlphabet = () => {
    const alphabet =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    return shuffle(alphabet, key)
  }
  const shuffle = (alphabet: string, key: string) => {
    const shuffledAlphabet = [...alphabet]

    for (let i = 0; i < key.length; i++) {
      const charCode = key.charCodeAt(i) % alphabet.length
      const shiftAmount = charCode < 0 ? charCode + alphabet.length : charCode

      for (let j = 0; j < alphabet.length; j++) {
        const newIndex = (j + shiftAmount) % alphabet.length
        const temp = shuffledAlphabet[j]
        shuffledAlphabet[j] = shuffledAlphabet[newIndex]
        shuffledAlphabet[newIndex] = temp
      }
    }

    return shuffledAlphabet.join('')
  }

  const base64Encode = (text: string) => {
    const shuffledAlphabet = getShuffledAlphabet()
    const alphabet =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    return [...btoa(text)]
      .map((char) => {
        const index = alphabet.indexOf(char)
        return index !== -1 ? shuffledAlphabet[index] : char
      })
      .join('')
  }

  const base64Decode = (encodedText: string) => {
    const shuffledAlphabet = getShuffledAlphabet()
    const alphabet =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    return atob(
      [...encodedText]
        .map((char) => {
          const index = shuffledAlphabet.indexOf(char)
          return index !== -1 ? alphabet[index] : char
        })
        .join('')
    )
  }

  return {
    encode: base64Encode,
    decode: (encodedText: string) => {
      if (encodedText.includes('?')) {
        encodedText = base64Encode(
          `${base64Decode(encodedText.split('?')[0])}?${encodedText.split('?')[1]}`
        )
      }
      return base64Decode(encodedText)
    }
  }
}

export const locationvariable: Codec = factory(
  (location.origin + navigator.userAgent).toUpperCase()
)
