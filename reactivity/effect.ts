class ReactiveEffect {
  private _fn;
  constructor(fn) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    this._fn();
  }
}
const targetMap = new Map();
let activeEffect;

export function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    depsMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
  }
  dep.add(activeEffect);
}

export function effect(effectFn) {
  const _effect = new ReactiveEffect(effectFn);
  _effect.run();
}
