import { reactive } from "../reactive";

describe("reactivity", () => {
  it("happy path", () => {
    const obj = { age: 10 };
    const observed = reactive(obj);
    expect(obj).not.toBe(observed);
    expect(obj.age).toBe(observed.age);
  });
});
