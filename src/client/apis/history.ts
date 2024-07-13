import { patchFunction } from '../patch'
import { rewriteStringOrUrl } from '../rewrite'

window.history.replaceState = patchFunction(
  window.history.replaceState,
  ([state, , url]) => {
    if (url) {
      url = rewriteStringOrUrl(url)
    }
    return [state, '', url]
  }
)
window.history.pushState = patchFunction(
  window.history.pushState,
  ([state, , url]) => {
    if (url) {
      url = rewriteStringOrUrl(url)
    }
    return [state, '', url]
  }
)
