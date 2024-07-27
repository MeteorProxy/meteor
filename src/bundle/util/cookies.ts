import IDBMap from '@webreflection/idb-map'
import { type CookieSerializeOptions, serialize } from 'cookie-es'
import { type Cookie, parse } from 'set-cookie-parser'
type ExtendedCookie = Cookie & { set?: number }

const cookies = new IDBMap('cookies')

export async function getCookies(host: string) {
  const now = new Date()
  const result: ExtendedCookie[] = []
  for (const key of await cookies.keys()) {
    if (key.startsWith(`${host}@`)) {
      let isExpired = false
      const cookie: ExtendedCookie = await cookies.get(key)
      if (cookie.set) {
        if (cookie.maxAge) {
          isExpired = cookie.set + cookie.maxAge * 1e3 < now.getTime()
        } else if (cookie.expires) {
          isExpired = cookie.expires.getTime() < now.getTime()
        }
      }
      if (isExpired) {
        await cookies.delete(key)
      } else {
        result.push(cookie)
      }
    }
  }
  const header = result.map((cookie) =>
    serialize(cookie.name, cookie.value, cookie as CookieSerializeOptions)
  )
  return header
}
export async function setCookies(header: string | string[], host: string) {
  const parsed = parse(header)
  for (const cookie of parsed) {
    await cookies.set(`${host}@${cookie.name}`, {
      set: Date.now(),
      ...cookie
    } satisfies ExtendedCookie)
  }
}
