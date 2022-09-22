import { track } from "./effect";

export function reactive(row) {
  return new Proxy(row, {
    get: (target, key, receiver) => {
      // 收集依赖
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set: (target, key, newValue, receiver) => {
      return Reflect.set(target, key, newValue, receiver);
    },
  });
}
