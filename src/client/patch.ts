// biome-ignore lint: types
type FunctionPatch = (...args: any[]) => any
// biome-ignore lint: types
type ConstructorPatch = new (...args: any[]) => any
// biome-ignore lint: types
type Arguments<T extends any[]> = (args: T) => T

export function patchFunction<T extends FunctionPatch>(
  originalFunction: T,
  argProcessor: Arguments<Parameters<T>>
): T {
  return new Proxy(originalFunction, {
    apply(target: T, thisArg: unknown, argArray: Parameters<T>): ReturnType<T> {
      const processedArgs = argProcessor(argArray)
      return Reflect.apply(target, thisArg, processedArgs)
    }
  }) as T
}

export function patchConstructor<T extends ConstructorPatch>(
  originalClass: T,
  argProcessor: Arguments<ConstructorParameters<T>>
): T {
  return new Proxy(originalClass, {
    construct(
      target: T,
      argArray: ConstructorParameters<T>,
      newTarget: T
    ): InstanceType<T> {
      const processedArgs = argProcessor(argArray)
      return Reflect.construct(target, processedArgs, newTarget)
    }
  }) as T
}
