const STORAGE_PREFIX = 'meteor$'
function webStorage(storage: Storage) {
  const filterForWebsite = () =>
    Object.keys(storage).filter((key) =>
      key.startsWith(STORAGE_PREFIX + window.__location.host)
    )
  return new Proxy(storage, {
    get(target, key) {
      switch (key) {
        case 'setItem':
          return (key: string, value: string) =>
            target.setItem(
              `${STORAGE_PREFIX}${window.__location.host}@${key}`,
              value
            )
        case 'getItem':
          return (key: string) =>
            target.getItem(`${STORAGE_PREFIX}${window.__location.host}@${key}`)
        case 'removeItem':
          return (key: string) =>
            target.removeItem(
              `${STORAGE_PREFIX}${window.__location.host}@${key}`
            )
        case 'clear':
          return () => {
            for (const key of filterForWebsite()) {
              target.removeItem(key)
            }
          }
        case 'length':
          return filterForWebsite().length
        case 'key':
          return (index: number) => target[filterForWebsite()[index]]
      }
    }
  })
}

const ls = webStorage(localStorage)
const ss = webStorage(sessionStorage)
window.localStorage = undefined
window.sessionStorage = undefined
window.localStorage = ls
window.sessionStorage = ss
