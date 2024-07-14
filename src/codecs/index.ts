declare global {
  interface Window {
    __meteor$codecs: {
      [key: string]: Codec
    }
  }
}

export interface Codec {
  encode: (string: string) => string
  decode: (string: string) => string
}

import { base64 } from './base64'
import { plain } from './plain'
import { xor } from './xor'

self.__meteor$codecs = {
  xor,
  base64,
  plain
}
