const STORAGE_PREFIX = 'meteor$'

function createStorageProxy(storage: Storage) {
  const filterBySite = () =>
    Object.keys(storage).filter((key) =>
      key.startsWith(STORAGE_PREFIX + window.$location.host)
    )

  return new Proxy(storage, {
    get(target, key) {
      switch (key) {
        case 'setItem':
          return (key: string, value: string) =>
            target.setItem(
              `${STORAGE_PREFIX}${window.$location.host}@${key}`,
              value
            )

        case 'getItem':
          return (key: string) =>
            target.getItem(`${STORAGE_PREFIX}${window.$location.host}@${key}`)

        case 'removeItem':
          return (key: string) =>
            target.removeItem(
              `${STORAGE_PREFIX}${window.$location.host}@${key}`
            )

        case 'clear':
          return () => {
            for (const key of filterBySite()) {
              target.removeItem(key)
            }
          }

        case 'length':
          return filterBySite().length

        case 'key':
          return (index: number) => target[filterBySite()[index]]
      }
    }
  })
}

const ls = createStorageProxy(window.localStorage)
const ss = createStorageProxy(window.sessionStorage)
// biome-ignore lint: you need to delete it like this, setting as undefined does NOT work
delete window.localStorage
// biome-ignore lint: ^
delete window.sessionStorage

window.localStorage = ls
window.sessionStorage = ss
