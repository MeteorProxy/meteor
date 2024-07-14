import { patchFunction } from '../patch'
import { rewriteStringOrUrl } from '../rewrite'
// biome-ignore lint:
const rwFun: any = ([state, , url]) => {
  if (url) {
    url = rewriteStringOrUrl(url)
  }
  return [state, '', url]
}
window.history.replaceState = patchFunction(window.history.replaceState, rwFun)
window.history.pushState = patchFunction(window.history.pushState, rwFun)

window.History.prototype.replaceState = patchFunction(
  window.History.prototype.replaceState,
  rwFun
)
window.History.prototype.pushState = patchFunction(
  window.History.prototype.pushState,
  rwFun
)
