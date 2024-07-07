type FunctionPatch = (...args: any[]) => any
type ConstructorPatch = new (...args: any[]) => any
type Arguments<T extends any[]> = (args: T) => T

export function patchFunction<T extends FunctionPatch>(
  originalFunction: T,
  argProcessor: Arguments<Parameters<T>>
): T {
  return new Proxy(originalFunction, {
    apply(target: T, thisArg: any, argArray: Parameters<T>): ReturnType<T> {
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
