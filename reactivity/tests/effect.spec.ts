import { effect, stop } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
  it("happy path", () => {
    const count = reactive({
      num: 10,
    });
    let effectCount;
    effect(() => {
      // effect 初始会先执行一遍，通过初始执行，便可以拿到其中的依赖
      effectCount = count.num + 1;
    });

    expect(effectCount).toBe(11);
    count.num++;
    expect(effectCount).toBe(12);
  });
  it("should return runner when call effect", () => {
    let num = 0;
    const runner = effect(() => {
      num++;
      return "hello world";
    });
    expect(num).toBe(1);
    const result = runner();
    expect(result).toBe("hello world");
    expect(num).toBe(2);
  });

  it("scheduler", () => {
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // // should not run yet
    expect(dummy).toBe(1);
    // // manually run
    run();
    // // should have run
    expect(dummy).toBe(2);
  });

  /**
   * 调用 stop 后，执行 set 操作，effect 中的 fn 不再执行
   * 可以手动调用 runner 执行 effect 中的 fn
   */
  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    // obj.prop = 3
    obj.prop++;
    expect(dummy).toBe(2);

    // stopped effect should still be manually callable
    runner();
    expect(dummy).toBe(3);
  });
});
