import { effect } from "../effect";
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
});
