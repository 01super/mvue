export function effect(effectFn) {}

export function reactive(target) {
  return new Proxy(target, {
    get: (key) => Reflect.get(target, key),
    set: (target, key, newValue, receiver) =>
      Reflect.set(target, key, newValue, receiver),
  });
}
