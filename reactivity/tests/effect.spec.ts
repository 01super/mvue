import { effect, reactive } from "../effect";

describe("effect", () => {
  it("happy path", () => {
    const count = reactive({
      num: 10,
    });
    let effectCount;
    effect(() => {
      effectCount = count.num;
    });

    expect(effectCount).toBe(10);
    count.num++;
    expect(effectCount).toBe(11);
  });
});
