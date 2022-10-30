import { track, trigger } from "./effect";
/**
 * reactive
 * createReactiveObject
 * new Proxy => 根据不同的 target 的类型创建不同的 handlers
 * @returns
 */
export function reactive(raw) {
  return new Proxy(raw, {
    get: (target, key, receiver) => {
      console.log(target === raw); // true
      // 收集依赖
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set: (target, key, value, receiver) => {
      const result = Reflect.set(target, key, value, receiver);
      // 触发依赖
      trigger(target, key, value);
      return result;
    },
  });
}
