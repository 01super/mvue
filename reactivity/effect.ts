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

/**
 * obj = {count: 1, age: 12}
 * targetMap = {
 *    [obj]: {
 *        count: [
 *          effect1.runner,
 *          effect3.runner
 *        ],
 *        age: [
 *          effect2.runner
 *        ]
 *    }
 * }
 */
// 收集依赖
export function track(target, key) {
  if (activeEffect) {
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
    activeEffect.deps.push(dep);
  }
}

// 触发依赖
export function trigger(target, key, value) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (let effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

class ReactiveEffect {
  private _fn;
  deps = [];
  // 调用 stop 后会变成 false
  active = true;
  public scheduler: Function | undefined;
  constructor(fn, scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
}

export function effect(effectFn, options: any = {}) {
  const _effect = new ReactiveEffect(effectFn, options.scheduler);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
