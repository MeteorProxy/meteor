type ApplyFunction = (...args: any[]) => any
type ConstructorFunction = new (...args: any[]) => any
type ArgProcessor<T extends any[]> = (args: T) => T

export function patchFunction<T extends ApplyFunction>(originalFunction: T, argProcessor: ArgProcessor<Parameters<T>>): T {
  return new Proxy(originalFunction, {
    apply(target: T, thisArg: any, argArray: Parameters<T>): ReturnType<T> {
      const processedArgs = argProcessor(argArray)
      return Reflect.apply(target, thisArg, processedArgs)
    }
  }) as T
}

export function patchConstructor<T extends ConstructorFunction>(originalClass: T, argProcessor: ArgProcessor<ConstructorParameters<T>>): T {
  return new Proxy(originalClass, {
    construct(target: T, argArray: ConstructorParameters<T>, newTarget: T): InstanceType<T> {
      const processedArgs = argProcessor(argArray)
      return Reflect.construct(target, processedArgs, newTarget)
    }
  }) as T
}
