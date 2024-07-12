import { patchConstructor, patchFunction } from '../patch'
import { rewriteStringOrUrl } from '../rewrite'
window.Worker = patchConstructor(Worker, (args) => [
  rewriteStringOrUrl(args[0], self.$meteor.util.createOrigin()),
  args[1]
])

window.Worklet.prototype.addModule = patchFunction(
  Worklet.prototype.addModule,
  (args) => [
    rewriteStringOrUrl(args[0], self.$meteor.util.createOrigin()),
    args[1]
  ]
)
