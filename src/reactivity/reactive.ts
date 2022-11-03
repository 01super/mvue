import { track, trigger } from "./effect";
import { mutableHandlers, readonlyHandlers } from "./baseHandlers";
/**
 * reactive
 * createReactiveObject
 * new Proxy => 根据不同的 target 的类型创建不同的 handlers
 * @returns
 */

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers);
}

function createActiveObject(raw: any, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}
