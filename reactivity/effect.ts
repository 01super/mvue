let activeEffect;
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
// target => depsMap
const targetMap = new Map();

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

export function trigger(target, key, value) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (let effect of dep) {
    effect.run();
  }
}

export function effect(effectFn) {
  const _effect = new ReactiveEffect(effectFn);
  _effect.run();
  return _effect.run.bind(_effect);
}
