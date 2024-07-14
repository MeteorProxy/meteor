import { patchFunction } from '../patch'

window.addEventListener = new Proxy(window.addEventListener, {
  apply(target, thisArg, [type, func, ...args]) {
    if (type === 'message' || type === 'messageerror') {
      func = patchFunction(func, ([event]: [MessageEvent]) => {
        Object.defineProperty(event, 'origin', {
          value: window.$location.origin,
          writable: false
        })
        return [event]
      })
    }
    if (type === 'hashchange') {
      func = patchFunction(func, ([event]: [HashChangeEvent]) => {
        Object.defineProperty(event, 'newURL', {
          value: self.$meteor.rewrite.url.decode(event.newURL),
          writable: false
        })
        Object.defineProperty(event, 'oldURL', {
          value: self.$meteor.rewrite.url.decode(event.oldURL),
          writable: false
        })
        return [event]
      })
    }
    return Reflect.apply(target, thisArg, [type, func, ...args])
  }
})
