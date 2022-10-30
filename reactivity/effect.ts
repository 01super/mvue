/**
 * init：
 * effect(fn) 创建 effect， 执行 fn，
 * 触发get操作， 执行 track， 把 effect 收集起来作为依赖
 *
 * update：
 * 修改响应式对象的值
 * 触发set
 * 执行trigger
 * 重新运行effect函数
 * 执行fn
 * 触发get操作
 */

let activeEffect;
// target => depsMap
const targetMap = new Map();

// 收集依赖
export function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  // key => effectFn
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  dep.add(activeEffect);
}

// 触发依赖
export function trigger(target, key, value) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (let effect of dep) {
    effect.run();
  }
}

class ReactiveEffect {
  private _fn;
  constructor(fn) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    const result = this._fn();
    return result;
  }
}

export function effect(effectFn) {
  const _effect = new ReactiveEffect(effectFn);
  _effect.run();
  return _effect.run.bind(_effect);
}
