import { patchConstructor, patchFunction } from '../patch'
window.Worker = patchConstructor(Worker, (args) => {
  if (typeof args[0] !== 'string') {
    args[0].host = location.host
    args[0].pathname = self.__meteor$config.prefix + args[0].pathname
    return [args[0], args[1]]
  }
  return [
    self.$meteor.rewrite.url.encode(args[0], self.$meteor.util.createOrigin()),
    args[1]
  ]
})

window.Worklet.prototype.addModule = patchFunction(
  Worklet.prototype.addModule,
  (args) => {
    if (typeof args[0] !== 'string') {
      args[0].host = location.host
      args[0].pathname = self.__meteor$config.prefix + args[0].pathname
      return [args[0], args[1]]
    }
    return [
      self.$meteor.rewrite.url.encode(
        args[0],
        self.$meteor.util.createOrigin()
      ),
      args[1]
    ]
  }
)
