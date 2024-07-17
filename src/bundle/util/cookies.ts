import IDBMap from '@webreflection/idb-map'
import { serialize } from 'cookie-es'
import { parse } from 'set-cookie-parser'
const cookies = new IDBMap('cookies')

export async function getCookies(host: string) {
  const now = new Date()
  const result: Record<string, string>[] = []
  for (const key of await cookies.keys()) {
    if (key.startsWith(`${host}@`)) {
      let isExpired = false
      const cookie = await cookies.get(key)
      if (cookie.maxAge) {
        isExpired = cookie.set.getTime() + cookie.maxAge * 1e3 < now
      } else if (cookie.expires) {
        isExpired = new Date(cookie.expires.toLocaleString()) < now
      }
      if (isExpired) {
        await cookies.delete(key)
      } else {
        result.push(cookie)
      }
    }
  }
  const header = result.map((cookie) =>
    serialize(cookie.name, cookie.value, cookie)
  )
  return header
}
export async function setCookies(header: string | string[], host: string) {
  const parsed = parse(header)
  for (const cookie of parsed) {
    await cookies.set(`${host}@${cookie.name}`, cookie.value)
  }
}
