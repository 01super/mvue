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

let activeEffect: any = null;
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
  if (activeEffect && activeEffect.active) {
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
  if (!depsMap) return;
  let dep = depsMap.get(key);
  for (let effect of dep) {
    if (effect.options.scheduler) {
      effect.options.scheduler();
    } else {
      effect.run();
    }
  }
}

class ReactiveEffect {
  private readonly _fn;
  deps = [];
  // 调用 stop 后会变成 false
  active = true;
  public options: any;
  constructor(fn, options) {
    this._fn = fn;
    this.options = options;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      this.options.onStop && this.options.onStop();
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
  const _effect = new ReactiveEffect(effectFn, options);
  _effect.run(); // 执行 run 的时候才需要收集依赖
  activeEffect = null; // 执行完后置空 activeEffect，不收集依赖
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
