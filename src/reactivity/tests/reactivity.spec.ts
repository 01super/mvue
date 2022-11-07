import { isReactive, reactive } from "../reactive";

describe("reactivity", () => {
  it("happy path", () => {
    const obj = { age: 10 };
    const observed = reactive(obj);
    expect(obj).not.toBe(observed);
    expect(obj.age).toBe(observed.age);
  });

  test("nested reactive", () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    };
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
  });
});
