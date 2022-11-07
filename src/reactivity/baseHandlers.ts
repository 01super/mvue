import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";
import { isObject } from "../shared";

function createGetter(isReadonly = false) {
  return function get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    }
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    const result = Reflect.get(target, key, receiver);

    if (isObject(result)) {
      return isReadonly ? readonly(result) : reactive(result);
    }

    if (!isReadonly) {
      // console.log(target === raw); // true
      // 收集依赖
      track(target, key);
    }
    return result;
  };
}

function createSetter() {
  return function set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);
    trigger(target, key, value);
    return result;
  };
}
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set: (target, key) => {
    console.warn(`key:${key} set 失败，target 是 readonly`);
    return true;
  },
};
