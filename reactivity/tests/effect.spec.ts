import { effect, reactive } from "../effect";

describe("effect", () => {
  it("happy path", () => {
    const count = reactive({
      num: 10,
    });
    let effectCount;
    effect(() => {
      // effect 初始会先执行一遍，通过初始执行，便可以拿到其中的依赖
      effectCount = count.num;
    });

    expect(effectCount).toBe(10);
    count.num++;
    expect(effectCount).toBe(11);
  });
});
