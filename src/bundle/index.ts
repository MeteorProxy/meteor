import { none, base64, xor } from './codecs'

declare global {
  interface Window {
    __meteor: typeof meteorBundle
  }
}

export const meteorBundle = {
  codecs: {
    none,
    base64,
    xor
  }
}

self.__meteor = meteorBundle
