import { track, trigger } from "./effect";

export function reactive(row) {
  return new Proxy(row, {
    get: (target, key, receiver) => {
      // 收集依赖
      // TODO 已经收集依赖的时候
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
