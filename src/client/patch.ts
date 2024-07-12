// biome-ignore lint: types
type FunctionPatch = (...args: any[]) => any
// biome-ignore lint: types
type ConstructorPatch = new (...args: any[]) => any
// biome-ignore lint: types
type Arguments<T extends any[]> = (args: T) => T

export function patchFunction<T extends FunctionPatch>(
  target: T,
  proxy: Arguments<Parameters<T>>
): T {
  return new Proxy(target, {
    apply(target: T, thisArg: unknown, argArray: Parameters<T>): ReturnType<T> {
      const proxiedArgs = proxy(argArray)
      return Reflect.apply(target, thisArg, proxiedArgs)
    }
  }) as T
}

export function patchConstructor<T extends ConstructorPatch>(
  target: T,
  proxy: Arguments<ConstructorParameters<T>>
): T {
  return new Proxy(target, {
    construct(
      target: T,
      argArray: ConstructorParameters<T>,
      newTarget: T
    ): InstanceType<T> {
      const proxiedArgs = proxy(argArray)
      return Reflect.construct(target, proxiedArgs, newTarget)
    }
  }) as T
}
